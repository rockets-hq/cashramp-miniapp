// Docs: https://docs.cashramp.co/cashramp/cashramp-api/queries

import { useToast } from "vue-toast-notification";

const $toast = useToast();

export class CashrampClient {
  constructor() {
    this.endpoint = import.meta.env.VITE_CASHRAMP_API_URL;
  }

  async _post(query, variables = {}) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_CASHRAMP_PUBLIC_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Cashramp API error: ${response.status} ${text}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length) {
      const message = json.errors.map((e) => e.message).join("; ");
      throw new Error(`Cashramp GraphQL error: ${message}`);
    }
    return json.data;
  }

  async getAvailableCountries() {
    const query = `
      query { 
        availableCountries { 
          id
          name
          code
          currency {
            isoCode
          }
        }
      }
    `;

    const data = await this._post(query);
    return data?.availableCountries ?? [];
  }

  async getMarketRate(countryCode) {
    if (!countryCode) {
      throw new Error("countryCode is required for getMarketRate");
    }

    const query = `
      query ($countryCode: String!) {
        marketRate(countryCode: $countryCode) {
          depositRate
          withdrawalRate
        }
      }
    `;

    const data = await this._post(query, { countryCode });
    return data?.marketRate ?? null;
  }

  async confirmTransaction(paymentRequestId, transactionHash) {
    const query = `
      mutation ($paymentRequest: ID!, $transactionHash: String!) {
        confirmTransaction(paymentRequest: $paymentRequest, transactionHash: $transactionHash)
      }
    `;

    const data = await this._post(query, {
      paymentRequest: paymentRequestId,
      transactionHash,
    });

    $toast.success(`Transaction confirmed: ${JSON.stringify(data)}`);

    return data?.confirmTransaction ?? null;
  }
}

export const cashrampClient = new CashrampClient({});
