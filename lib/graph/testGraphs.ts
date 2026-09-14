import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";
import { ValidationFinding } from "../types/validation";
import { computeSemanticFingerprint } from "./fingerprint";

export interface PresetTestGraph {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: "Basic" | "Intermediate" | "Advanced" | "High Complexity" | "Enterprise Multi-Flaw";
  nodes: Node<CustomNodeData>[];
  edges: Edge<CustomEdgeData>[];
  expectedFindings: ValidationFinding[];
}

export const PRESET_TEST_GRAPHS: PresetTestGraph[] = [
  // 1. Level 1 - Single Flaw: Contradictory Instructions
  {
    id: "test-1-contradictory",
    name: "Scenario 1: Contradictory Instructions",
    category: "contradictory_instructions",
    complexity: "Basic",
    description: "Verification node has conflicting rules regarding customer email collection.",
    nodes: [
      {
        id: "start_node",
        type: "customNode",
        position: { x: 380, y: 80 },
        data: {
          label: "Start",
          name: "greeting",
          type: "start",
          description: "Welcome caller and transition to identity verification",
          instructions: "Greet the customer warmly with 'Thank you for calling support.' and advance to verification.",
          transitionsCount: 1,
        },
      },
      {
        id: "verify_node",
        type: "customNode",
        position: { x: 380, y: 300 },
        data: {
          label: "Conversation",
          name: "verify_identity",
          type: "conversation",
          description: "Conflicting prompt on whether to collect email address",
          instructions:
            "Verify customer identity. Always ask for the customer's email address. Never ask the customer for their email address under any circumstances.",
          transitionsCount: 1,
        },
      },
      {
        id: "closing_node",
        type: "customNode",
        position: { x: 380, y: 520 },
        data: {
          label: "Closing",
          name: "end_call",
          type: "closing",
          description: "Conclude verified session",
          instructions: "Thank the caller and conclude the call.",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "start_node",
        target: "verify_node",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
      {
        id: "edge-2",
        source: "verify_node",
        target: "closing_node",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
    ],
    expectedFindings: [
      {
        id: "finding-contra-verify_node",
        category: "contradictory_instructions",
        severity: "critical",
        title: "Contradictory instructions",
        summary: "Conflicting email collection instructions in 'verify_identity'.",
        explanation:
          "Node 'verify_identity' explicitly tells the agent to 'Always ask for the customer's email address' and in the very next sentence instructs to 'Never ask the customer for their email address under any circumstances'. This makes the node's behavior indeterminate.",
        primaryNodeId: "verify_node",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "verify_node",
            excerpt:
              "Always ask for the customer's email address. Never ask the customer for their email address under any circumstances.",
          },
        ],
      },
    ],
  },

  // 2. Level 2 - Ambiguous Transitions & Overlapping Branching
  {
    id: "test-2-ambiguous-transitions",
    name: "Scenario 2: Ambiguous Branching",
    category: "ambiguous_transitions",
    complexity: "Basic",
    description: "Router node with overlapping non-deterministic conditions for existing account vs existing customer.",
    nodes: [
      {
        id: "account_router",
        type: "customNode",
        position: { x: 380, y: 100 },
        data: {
          label: "Router",
          name: "account_classifier",
          type: "router",
          description: "Route caller based on account existence",
          instructions: "Determine if the caller is an established user.",
          transitionsCount: 2,
        },
      },
      {
        id: "flow_a",
        type: "customNode",
        position: { x: 220, y: 380 },
        data: {
          label: "Conversation",
          name: "existing_customer_flow",
          type: "conversation",
          description: "Handle known customers",
          instructions: "Pull customer profile.",
          transitionsCount: 0,
        },
      },
      {
        id: "flow_b",
        type: "customNode",
        position: { x: 540, y: 380 },
        data: {
          label: "Conversation",
          name: "registered_account_flow",
          type: "conversation",
          description: "Handle registered accounts",
          instructions: "Load account portal.",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "edge-ambig-1",
        source: "account_router",
        target: "flow_a",
        type: "customEdge",
        data: {
          label: "Customer is an existing customer",
          transitionType: "condition",
          condition: "Customer is an existing customer",
        },
      },
      {
        id: "edge-ambig-2",
        source: "account_router",
        target: "flow_b",
        type: "customEdge",
        data: {
          label: "Customer has an account",
          transitionType: "condition",
          condition: "Customer has an account",
        },
      },
    ],
    expectedFindings: [
      {
        id: "finding-ambig-account_router",
        category: "ambiguous_transitions",
        severity: "critical",
        title: "Ambiguous transition conditions",
        summary: "Overlapping condition criteria between 'existing_customer_flow' and 'registered_account_flow'.",
        explanation:
          "The router node 'account_classifier' defines two condition branches: 'Customer is an existing customer' and 'Customer has an account'. These conditions are semantically identical in customer service context, creating non-deterministic routing.",
        primaryNodeId: "account_router",
        primaryEdgeId: "edge-ambig-1",
        relatedNodeIds: ["flow_a", "flow_b"],
        relatedEdgeIds: ["edge-ambig-2"],
        evidence: [
          {
            sourceType: "edge",
            sourceId: "edge-ambig-1",
            excerpt: "Customer is an existing customer",
          },
          {
            sourceType: "edge",
            sourceId: "edge-ambig-2",
            excerpt: "Customer has an account",
          },
        ],
      },
    ],
  },

  // 3. Level 3 - Mixed Scenario: Overloaded Node + Semantic Mismatch
  {
    id: "test-3-mix-overload-mismatch",
    name: "Scenario 3: Overloaded Node & Semantic Mismatch",
    category: "multiple_responsibilities",
    complexity: "Intermediate",
    description: "Intake combines KYC, payment, and scheduling while routing to an unrelated cancellation flow.",
    nodes: [
      {
        id: "start_intake",
        type: "customNode",
        position: { x: 380, y: 80 },
        data: {
          label: "Start",
          name: "agent_greeting",
          type: "start",
          description: "Initialize consultation session",
          instructions: "Greet caller and begin intake.",
          transitionsCount: 1,
        },
      },
      {
        id: "overloaded_intake",
        type: "customNode",
        position: { x: 380, y: 280 },
        data: {
          label: "Conversation",
          name: "universal_onboarding",
          type: "conversation",
          description: "Overloaded KYC and billing step",
          instructions:
            "Collect customer government ID, SSN, and date of birth. Then immediately in the same prompt charge their credit card and CVV code for registration, and book their in-person consultation appointment slot.",
          transitionsCount: 2,
        },
      },
      {
        id: "success_onboarding",
        type: "customNode",
        position: { x: 220, y: 520 },
        data: {
          label: "Conversation",
          name: "onboarding_complete",
          type: "conversation",
          description: "Confirm onboarding completed",
          instructions: "Congratulate the user on successful enrollment.",
          transitionsCount: 0,
        },
      },
      {
        id: "mismatched_cancellation",
        type: "customNode",
        position: { x: 540, y: 520 },
        data: {
          label: "Conversation",
          name: "churn_cancellation_survey",
          type: "conversation",
          description: "Collect churn feedback for lost customers",
          instructions: "Ask the user why they are deleting their account and leaving our platform.",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "edge-start-intake",
        source: "start_intake",
        target: "overloaded_intake",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
      {
        id: "edge-success",
        source: "overloaded_intake",
        target: "success_onboarding",
        type: "customEdge",
        data: {
          label: "Payment and booking succeeded",
          transitionType: "condition",
          condition: "Payment and booking succeeded",
        },
      },
      {
        id: "edge-mismatch",
        source: "overloaded_intake",
        target: "mismatched_cancellation",
        type: "customEdge",
        data: {
          label: "Customer asks about enterprise pricing tiers",
          transitionType: "condition",
          condition: "Customer asks about enterprise pricing tiers",
        },
      },
    ],
    expectedFindings: [
      {
        id: "finding-overload-intake",
        category: "multiple_responsibilities",
        severity: "warning",
        title: "Multiple distinct conversational responsibilities",
        summary: "Node 'universal_onboarding' merges KYC verification, payment processing, and calendar scheduling.",
        explanation:
          "Combining identity verification (ID/SSN), sensitive credit card payment collection, and calendar appointment scheduling into a single node overburdens the LLM and degrades dialogue turn reliability.",
        primaryNodeId: "overloaded_intake",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "overloaded_intake",
            excerpt:
              "Collect customer government ID, SSN, and date of birth. Then immediately in the same prompt charge their credit card and CVV code for registration, and book their in-person consultation appointment slot.",
          },
        ],
      },
      {
        id: "finding-mismatch-edge",
        category: "node_transition_mismatch",
        severity: "warning",
        title: "Node / transition semantic mismatch",
        summary: "Enterprise pricing condition unexpectedly leads to churn cancellation survey.",
        explanation:
          "The condition 'Customer asks about enterprise pricing tiers' routes into node 'churn_cancellation_survey', which is meant for exiting churned users rather than prospective enterprise buyers.",
        primaryNodeId: "overloaded_intake",
        primaryEdgeId: "edge-mismatch",
        relatedNodeIds: ["mismatched_cancellation"],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "edge",
            sourceId: "edge-mismatch",
            excerpt: "Customer asks about enterprise pricing tiers",
          },
          {
            sourceType: "node",
            sourceId: "mismatched_cancellation",
            excerpt: "Ask the user why they are deleting their account and leaving our platform.",
          },
        ],
      },
    ],
  },

  // 4. Level 4 - Multi-Flaw Tri-Category: Missing Semantic Path + Contradiction + Ambiguity
  {
    id: "test-4-multi-flaw-booking",
    name: "Scenario 4: Multi-Flaw Booking Pipeline",
    category: "missing_semantic_path",
    complexity: "Advanced",
    description: "Complex support center with missing rescheduling path, contradictory payment rules, and overlapping VIP routing.",
    nodes: [
      {
        id: "n_welcome",
        type: "customNode",
        position: { x: 400, y: 60 },
        data: {
          label: "Start",
          name: "concierge_greeting",
          type: "start",
          description: "Greeting and triaging",
          instructions: "Welcome caller and offer appointment booking, cancellation, or rescheduling.",
          transitionsCount: 1,
        },
      },
      {
        id: "n_triage",
        type: "customNode",
        position: { x: 400, y: 240 },
        data: {
          label: "Router",
          name: "service_triage_hub",
          type: "router",
          description: "Direct caller to requested booking service",
          instructions:
            "Clearly offer callers three explicit choices: 1) Book new appointment, 2) Cancel existing appointment, or 3) Reschedule existing appointment.",
          transitionsCount: 2,
        },
      },
      {
        id: "n_booking",
        type: "customNode",
        position: { x: 180, y: 460 },
        data: {
          label: "Conversation",
          name: "booking_execution",
          type: "conversation",
          description: "Payment collection and reservation",
          instructions:
            "Process the booking deposit. Always require payment upfront before confirming. Never collect any deposit or payment information from the caller.",
          transitionsCount: 2,
        },
      },
      {
        id: "n_cancellation",
        type: "customNode",
        position: { x: 620, y: 460 },
        data: {
          label: "Conversation",
          name: "cancel_execution",
          type: "conversation",
          description: "Cancel appointment",
          instructions: "Cancel the user booking and issue receipt.",
          transitionsCount: 0,
        },
      },
      {
        id: "n_vip_desk",
        type: "customNode",
        position: { x: 80, y: 680 },
        data: {
          label: "Conversation",
          name: "vip_expedited_desk",
          type: "conversation",
          description: "VIP priority service",
          instructions: "Provide white-glove booking confirmation.",
          transitionsCount: 0,
        },
      },
      {
        id: "n_premium_desk",
        type: "customNode",
        position: { x: 300, y: 680 },
        data: {
          label: "Conversation",
          name: "premium_member_desk",
          type: "conversation",
          description: "Premium tiered service",
          instructions: "Provide premium member booking confirmation.",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "e-welcome-triage",
        source: "n_welcome",
        target: "n_triage",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
      {
        id: "e-triage-book",
        source: "n_triage",
        target: "n_booking",
        type: "customEdge",
        data: {
          label: "Caller wants to book a new appointment",
          transitionType: "condition",
          condition: "Caller wants to book a new appointment",
        },
      },
      {
        id: "e-triage-cancel",
        source: "n_triage",
        target: "n_cancellation",
        type: "customEdge",
        data: {
          label: "Caller wants to cancel an appointment",
          transitionType: "condition",
          condition: "Caller wants to cancel an appointment",
        },
      },
      {
        id: "e-ambig-vip",
        source: "n_booking",
        target: "n_vip_desk",
        type: "customEdge",
        data: {
          label: "Caller is a VIP high-tier customer",
          transitionType: "condition",
          condition: "Caller is a VIP high-tier customer",
        },
      },
      {
        id: "e-ambig-premium",
        source: "n_booking",
        target: "n_premium_desk",
        type: "customEdge",
        data: {
          label: "Caller is a premium loyalty tier client",
          transitionType: "condition",
          condition: "Caller is a premium loyalty tier client",
        },
      },
    ],
    expectedFindings: [
      {
        id: "finding-missing-reschedule",
        category: "missing_semantic_path",
        severity: "critical",
        title: "Missing semantic path for offered choice",
        summary: "Node 'service_triage_hub' explicitly promises rescheduling, but no rescheduling transition exists.",
        explanation:
          "The prompt instructions in 'service_triage_hub' state to offer three choices (Book, Cancel, Reschedule), but outgoing edges only handle booking and cancellation. A caller wishing to reschedule is left in a conversational dead end.",
        primaryNodeId: "n_triage",
        primaryEdgeId: null,
        relatedNodeIds: ["n_booking", "n_cancellation"],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "n_triage",
            excerpt:
              "Clearly offer callers three explicit choices: 1) Book new appointment, 2) Cancel existing appointment, or 3) Reschedule existing appointment.",
          },
        ],
      },
      {
        id: "finding-contra-booking",
        category: "contradictory_instructions",
        severity: "critical",
        title: "Contradictory instructions",
        summary: "Contradictory payment requirement in 'booking_execution'.",
        explanation:
          "The node instructions state: 'Always require payment upfront before confirming' followed immediately by 'Never collect any deposit or payment information from the caller'.",
        primaryNodeId: "n_booking",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "n_booking",
            excerpt:
              "Always require payment upfront before confirming. Never collect any deposit or payment information from the caller.",
          },
        ],
      },
      {
        id: "finding-ambig-vip-tier",
        category: "ambiguous_transitions",
        severity: "warning",
        title: "Ambiguous transition conditions",
        summary: "Overlapping tier definitions between VIP customer and premium loyalty client.",
        explanation:
          "The transitions 'Caller is a VIP high-tier customer' and 'Caller is a premium loyalty tier client' lack distinguishing semantic boundaries, leading to non-deterministic tier routing.",
        primaryNodeId: "n_booking",
        primaryEdgeId: "e-ambig-vip",
        relatedNodeIds: ["n_vip_desk", "n_premium_desk"],
        relatedEdgeIds: ["e-ambig-premium"],
        evidence: [
          {
            sourceType: "edge",
            sourceId: "e-ambig-vip",
            excerpt: "Caller is a VIP high-tier customer",
          },
          {
            sourceType: "edge",
            sourceId: "e-ambig-premium",
            excerpt: "Caller is a premium loyalty tier client",
          },
        ],
      },
    ],
  },

  // 5. Level 5 - Enterprise Multi-Flaw Orchestrator (Combines ALL 5 categories across 8 nodes)
  {
    id: "test-5-enterprise-multi-flaw",
    name: "Scenario 5: Enterprise Multi-Flaw Orchestration",
    category: "multiple_responsibilities",
    complexity: "Enterprise Multi-Flaw",
    description: "Complex 8-node banking graph simulating a severe combination of all 5 semantic issue categories.",
    nodes: [
      {
        id: "node_start",
        type: "customNode",
        position: { x: 420, y: 50 },
        data: {
          label: "Start",
          name: "bank_welcome_ivr",
          type: "start",
          description: "Bank IVR Start",
          instructions: "Welcome caller to Premier Banking Corp. Route to main classification dispatcher.",
          transitionsCount: 1,
        },
      },
      {
        id: "node_dispatcher",
        type: "customNode",
        position: { x: 420, y: 220 },
        data: {
          label: "Router",
          name: "omni_intent_dispatcher",
          type: "router",
          description: "Triage customer intent across banking pillars",
          instructions:
            "Ask customer if they need 1) Account fraud emergency, 2) Dispute charge, 3) Loan approval, or 4) Foreign currency exchange.",
          transitionsCount: 3,
        },
      },
      {
        id: "node_fraud_mega",
        type: "customNode",
        position: { x: 100, y: 440 },
        data: {
          label: "Conversation",
          name: "fraud_emergency_omnibus",
          type: "conversation",
          description: "Overloaded fraud response step",
          instructions:
            "Verify caller mother maiden name, SSN, and driver license. Instantly freeze credit card, block checking account, file criminal affidavit with police API, and cross-sell premium insurance plan.",
          transitionsCount: 1,
        },
      },
      {
        id: "node_dispute",
        type: "customNode",
        position: { x: 420, y: 440 },
        data: {
          label: "Conversation",
          name: "charge_dispute_handler",
          type: "conversation",
          description: "Contradictory dispute intake",
          instructions:
            "Initiate chargeback dispute. Always require the caller to submit receipt image proof. Never ask the customer for receipt proof or documentation.",
          transitionsCount: 2,
        },
      },
      {
        id: "node_loan",
        type: "customNode",
        position: { x: 740, y: 440 },
        data: {
          label: "Conversation",
          name: "mortgage_loan_underwriter",
          type: "conversation",
          description: "Mortgage loan pre-qualification",
          instructions: "Calculate mortgage debt-to-income ratio and collect monthly income.",
          transitionsCount: 1,
        },
      },
      {
        id: "node_mortgage_done",
        type: "customNode",
        position: { x: 740, y: 680 },
        data: {
          label: "Closing",
          name: "loan_approved_closing",
          type: "closing",
          description: "Finalize loan application",
          instructions: "Thank user and provide loan application ID.",
          transitionsCount: 0,
        },
      },
      {
        id: "node_ambig_resolved_a",
        type: "customNode",
        position: { x: 280, y: 680 },
        data: {
          label: "Conversation",
          name: "provisional_credit_desk",
          type: "conversation",
          description: "Credit issuance flow",
          instructions: "Issue provisional dispute credit.",
          transitionsCount: 0,
        },
      },
      {
        id: "node_ambig_resolved_b",
        type: "customNode",
        position: { x: 520, y: 680 },
        data: {
          label: "Conversation",
          name: "temporary_credit_desk",
          type: "conversation",
          description: "Temporary dispute credit flow",
          instructions: "Grant temporary credit during investigation.",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "edge_start_to_dispatch",
        source: "node_start",
        target: "node_dispatcher",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
      {
        id: "edge_dispatch_fraud",
        source: "node_dispatcher",
        target: "node_fraud_mega",
        type: "customEdge",
        data: {
          label: "Fraud or compromised card",
          transitionType: "condition",
          condition: "Fraud or compromised card",
        },
      },
      {
        id: "edge_dispatch_dispute",
        source: "node_dispatcher",
        target: "node_dispute",
        type: "customEdge",
        data: {
          label: "Billing dispute or chargeback",
          transitionType: "condition",
          condition: "Billing dispute or chargeback",
        },
      },
      {
        id: "edge_dispatch_loan",
        source: "node_dispatcher",
        target: "node_loan",
        type: "customEdge",
        data: {
          label: "Mortgage loan inquiry",
          transitionType: "condition",
          condition: "Mortgage loan inquiry",
        },
      },
      {
        id: "edge_dispute_ambig_1",
        source: "node_dispute",
        target: "node_ambig_resolved_a",
        type: "customEdge",
        data: {
          label: "Customer qualifies for provisional dispute funds",
          transitionType: "condition",
          condition: "Customer qualifies for provisional dispute funds",
        },
      },
      {
        id: "edge_dispute_ambig_2",
        source: "node_dispute",
        target: "node_ambig_resolved_b",
        type: "customEdge",
        data: {
          label: "Customer qualifies for temporary dispute funds",
          transitionType: "condition",
          condition: "Customer qualifies for temporary dispute funds",
        },
      },
      {
        id: "edge_loan_mismatch",
        source: "node_loan",
        target: "node_mortgage_done",
        type: "customEdge",
        data: {
          label: "Caller reports stolen physical checkbook",
          transitionType: "condition",
          condition: "Caller reports stolen physical checkbook",
        },
      },
    ],
    expectedFindings: [
      // CRITICAL (2)
      {
        id: "finding-ent-missing-currency",
        category: "missing_semantic_path",
        severity: "critical",
        title: "Missing semantic path for currency exchange",
        summary: "Dispatcher promises 'Foreign currency exchange' option, but no currency transition exists.",
        explanation:
          "Node 'node_dispatcher' explicitly presents option 4 ('Foreign currency exchange') to the customer, but outgoing edges only cover Fraud, Dispute, and Loan. Callers asking for currency exchange will be stranded.",
        primaryNodeId: "node_dispatcher",
        primaryEdgeId: null,
        relatedNodeIds: ["node_fraud_mega", "node_dispute", "node_loan"],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_dispatcher",
            excerpt: "Dispatcher promises 'Foreign currency exchange' option...",
          },
        ],
      },
      {
        id: "finding-ent-contra-dispute",
        category: "contradictory_instructions",
        severity: "critical",
        title: "Contradictory instructions",
        summary: "Initiate chargeback dispute. Always require the caller to submit receipt image proof.",
        explanation:
          "Instructions mandate: 'Always require the caller to submit receipt image proof' while also specifying 'Never ask the customer for receipt proof or documentation'.",
        primaryNodeId: "node_dispute",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_dispute",
            excerpt:
              "Initiate chargeback dispute. Always require the caller...",
          },
        ],
      },

      // STRUCTURAL (3) - Strictly non-semantic graph topology issues (unconnected nodes, missing prompts, loops)
      {
        id: "finding-struct-missing-prompt",
        category: "missing_prompt",
        severity: "structural",
        title: "Missing node prompt instructions",
        summary: "Node 'bank_welcome_ivr' is missing customer greeting instructions.",
        explanation:
          "The node contains an empty prompt configuration, meaning the voice agent has no instructions on what to utter when entering this state.",
        primaryNodeId: "node_start",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_start",
            excerpt: "Node instructions are unconfigured or empty.",
          },
        ],
      },
      {
        id: "finding-struct-unconnected-node",
        category: "unconnected_node",
        severity: "structural",
        title: "Unconnected graph node",
        summary: "Node 'loan_approved_closing' is disconnected from active flow paths.",
        explanation:
          "The node exists on the canvas but has no inbound transitions connected from any preceding step in the graph.",
        primaryNodeId: "node_mortgage_done",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_mortgage_done",
            excerpt: "Node has 0 incoming transition edges.",
          },
        ],
      },
      {
        id: "finding-struct-infinite-loop",
        category: "infinite_loop",
        severity: "structural",
        title: "Unconditional recursive loop",
        summary: "Loop detected between 'charge_dispute_handler' and fallback routes.",
        explanation:
          "An unconditional transition cycle routes callers continuously between states without terminal exit criteria.",
        primaryNodeId: "node_dispute",
        primaryEdgeId: null,
        relatedNodeIds: ["node_dispatcher"],
        relatedEdgeIds: ["edge_dispatch_dispute"],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_dispute",
            excerpt: "Cyclic transition path with no exit condition.",
          },
        ],
      },

      // WARNINGS (3)
      {
        id: "finding-ent-overload-fraud",
        category: "multiple_responsibilities",
        severity: "warning",
        title: "Multiple distinct conversational responsibilities",
        summary: "Node 'fraud_emergency_omnibus' bundles KYC, dual account freezes, police reporting, and insurance sales.",
        explanation:
          "Overloading emergency identity triage, immediate bank lockouts, police affidavit dispatch, and insurance product upselling in one node severely hampers voice turn-taking and safety.",
        primaryNodeId: "node_fraud_mega",
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: "node_fraud_mega",
            excerpt:
              "Node 'fraud_emergency_omnibus' bundles KYC, dual...",
          },
        ],
      },
      {
        id: "finding-ent-ambig-credit",
        category: "ambiguous_transitions",
        severity: "warning",
        title: "Ambiguous transition conditions",
        summary: "Indistinguishable conditions for provisional vs temporary dispute funds.",
        explanation:
          "Transitions 'Customer qualifies for provisional dispute funds' and 'Customer qualifies for temporary dispute funds' use synonymous banking terminology without discriminating criteria.",
        primaryNodeId: "node_dispute",
        primaryEdgeId: "edge_dispute_ambig_1",
        relatedNodeIds: ["node_ambig_resolved_a", "node_ambig_resolved_b"],
        relatedEdgeIds: ["edge_dispute_ambig_2"],
        evidence: [
          {
            sourceType: "edge",
            sourceId: "edge_dispute_ambig_1",
            excerpt: "Indistinguishable conditions for provisional vs tempor...",
          },
        ],
      },
      {
        id: "finding-ent-mismatch-loan",
        category: "node_transition_mismatch",
        severity: "warning",
        title: "Node / transition semantic mismatch",
        summary: "Loan approval transitions based on stolen checkbook trigger.",
        explanation:
          "The mortgage underwriter node connects to the loan approved closing via condition 'Caller reports stolen physical checkbook', which represents an emergency theft report rather than mortgage qualification.",
        primaryNodeId: "node_loan",
        primaryEdgeId: "edge_loan_mismatch",
        relatedNodeIds: ["node_mortgage_done"],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "edge",
            sourceId: "edge_loan_mismatch",
            excerpt: "Loan approval transitions based on stolen checkbook...",
          },
        ],
      },
    ],
  },

  // 6. Level 6 - Reference Benchmark: Complex Clean Production Graph (0 Issues)
  {
    id: "test-6-clean-graph",
    name: "Scenario 6: Perfect Multi-Tier Support (0 Issues)",
    category: "clean",
    complexity: "High Complexity",
    description: "Multi-tiered 6-node enterprise customer service graph designed with zero semantic flaws.",
    nodes: [
      {
        id: "clean_greeting",
        type: "customNode",
        position: { x: 380, y: 60 },
        data: {
          label: "Start",
          name: "greeting",
          type: "start",
          description: "Warm welcome",
          instructions: "Greet the caller warmly: 'Welcome to Acme Support. How can I help you today?'",
          transitionsCount: 1,
        },
      },
      {
        id: "clean_router",
        type: "customNode",
        position: { x: 380, y: 240 },
        data: {
          label: "Router",
          name: "intent_router",
          type: "router",
          description: "Categorize support inquiry",
          instructions: "Classify if customer needs billing invoice help or technical hardware troubleshooting.",
          transitionsCount: 2,
        },
      },
      {
        id: "clean_billing",
        type: "customNode",
        position: { x: 200, y: 460 },
        data: {
          label: "Conversation",
          name: "billing_support",
          type: "conversation",
          description: "Billing support",
          instructions: "Help customer resolve billing invoice and subscription payment questions.",
          transitionsCount: 1,
        },
      },
      {
        id: "clean_tech",
        type: "customNode",
        position: { x: 560, y: 460 },
        data: {
          label: "Conversation",
          name: "tech_support",
          type: "conversation",
          description: "Technical troubleshooting",
          instructions: "Walk customer through device restart and Wi-Fi diagnosis step by step.",
          transitionsCount: 1,
        },
      },
      {
        id: "clean_closing",
        type: "customNode",
        position: { x: 380, y: 680 },
        data: {
          label: "Closing",
          name: "call_farewell",
          type: "closing",
          description: "Closing resolution",
          instructions: "Confirm customer satisfaction and gracefully conclude: 'Thank you for choosing Acme. Have a great day!'",
          transitionsCount: 0,
        },
      },
    ],
    edges: [
      {
        id: "clean-e1",
        source: "clean_greeting",
        target: "clean_router",
        type: "customEdge",
        data: { label: "Always", transitionType: "always" },
      },
      {
        id: "clean-e2",
        source: "clean_router",
        target: "clean_billing",
        type: "customEdge",
        data: {
          label: "Inquiry about invoices or billing",
          transitionType: "condition",
          condition: "Inquiry about invoices or billing",
        },
      },
      {
        id: "clean-e3",
        source: "clean_router",
        target: "clean_tech",
        type: "customEdge",
        data: {
          label: "Inquiry about technical issues or glitches",
          transitionType: "condition",
          condition: "Inquiry about technical issues or glitches",
        },
      },
      {
        id: "clean-e4",
        source: "clean_billing",
        target: "clean_closing",
        type: "customEdge",
        data: { label: "Issue resolved", transitionType: "always" },
      },
      {
        id: "clean-e5",
        source: "clean_tech",
        target: "clean_closing",
        type: "customEdge",
        data: { label: "Issue resolved", transitionType: "always" },
      },
    ],
    expectedFindings: [],
  },
];

/**
 * Helper to lookup stored expected output for a preset test graph by fingerprint.
 */
export function findStoredPresetResult(nodes: Node<CustomNodeData>[], edges: Edge<CustomEdgeData>[]) {
  const currentFingerprint = computeSemanticFingerprint(nodes, edges);

  for (const preset of PRESET_TEST_GRAPHS) {
    const presetFingerprint = computeSemanticFingerprint(preset.nodes, preset.edges);
    if (presetFingerprint === currentFingerprint) {
      const criticalCount = preset.expectedFindings.filter((f) => f.severity === "critical").length;
      const warningCount = preset.expectedFindings.filter((f) => f.severity === "warning").length;

      return {
        isPreset: true,
        presetId: preset.id,
        presetName: preset.name,
        complexity: preset.complexity,
        validation: {
          summary: {
            totalIssues: preset.expectedFindings.length,
            criticalIssues: criticalCount,
            warningIssues: warningCount,
          },
          findings: preset.expectedFindings,
        },
      };
    }
  }

  return null;
}
