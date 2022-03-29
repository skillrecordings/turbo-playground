export const stripeCharge = {
  charge: {
    id: 'ch_3KiPwSGkhzh8cL1J1BIuzaxu',
    object: 'charge',
    amount: 52500,
    amount_captured: 52500,
    amount_refunded: 0,
    application: null,
    application_fee: null,
    application_fee_amount: null,
    balance_transaction: 'txn_3KiPwSGkhzh8cL1J18ZVrtvx',
    billing_details: {
      address: [Object],
      email: 'joel+62626@egghead.io',
      name: 'Joel Hooks',
      phone: null,
    },
    calculated_statement_descriptor: 'TESTINGACCESSIBILITY.C',
    captured: true,
    created: 1648502297,
    currency: 'usd',
    customer: 'cus_LPEPFM3zSSKi0g',
    description: null,
    destination: null,
    dispute: null,
    disputed: false,
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    fraud_details: {},
    invoice: null,
    livemode: false,
    metadata: {},
    on_behalf_of: null,
    order: null,
    outcome: {
      network_status: 'approved_by_network',
      reason: null,
      risk_level: 'normal',
      risk_score: 37,
      seller_message: 'Payment complete.',
      type: 'authorized',
    },
    paid: true,
    payment_intent: 'pi_3KiPwSGkhzh8cL1J1dq77LRU',
    payment_method: 'pm_1KiPx6Gkhzh8cL1JYeEId75n',
    payment_method_details: {card: [Object], type: 'card'},
    receipt_email: null,
    receipt_number: null,
    receipt_url:
      'https://pay.stripe.com/receipts/acct_1JXTKiGkhzh8cL1J/ch_3KiPwSGkhzh8cL1J1BIuzaxu/rcpt_LPEPRJ7Q63mt56SwEHcxGGsQTyjcl8N',
    refunded: false,
    refunds: {
      object: 'list',
      data: [],
      has_more: false,
      total_count: 0,
      url: '/v1/charges/ch_3KiPwSGkhzh8cL1J1BIuzaxu/refunds',
    },
    review: null,
    shipping: null,
    source: null,
    source_transfer: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: 'succeeded',
    transfer_data: null,
    transfer_group: null,
  },
}
