// lib/leadfeeder.ts
/**
 * Leadfeeder API Client
 * Fetches lead data from Leadfeeder API
 */

export type LeadfeederLead = {
    id: string;
    type: string;
    attributes: {
      name: string;
      industry?: string;
      industries?: Array<{ name: string }>;
      first_visit_date: string;
      last_visit_date: string;
      status?: string;
      website_url?: string;
      phone?: string;
      linkedin_url?: string;
      twitter_handle?: string;
      facebook_url?: string;
      employee_count?: number;
      logo_url?: string;
      assignee?: string | null;
      business_id?: string | null;
      revenue?: string | null;
      quality: number; // 0-10 from Leadfeeder
      visits: number;
    };
    relationships?: {
      location?: {
        data: {
          id: string;
          type: string;
        };
      };
    };
  };

  export type LeadfeederLocation = {
    id: string;
    type: string;
    attributes: {
      country?: string;
      country_code?: string;
      region?: string;
      city?: string;
      state_code?: string;
    };
  };

  export type LeadfeederResponse = {
    data: LeadfeederLead[];
    included?: LeadfeederLocation[];
    links?: {
      self?: string;
      next?: string;
      last?: string;
    };
  };
  
  /**
   * Fetch leads from Leadfeeder API
   */
  export async function fetchLeadfeederLeads(
    accountId: string,
    startDate: string,
    endDate: string,
    apiToken: string,
    pageSize: number = 100
  ): Promise<LeadfeederResponse> {
    const url = new URL(`https://api.leadfeeder.com/accounts/${accountId}/leads`);
    url.searchParams.set('start_date', startDate);
    url.searchParams.set('end_date', endDate);
    url.searchParams.set('page[size]', pageSize.toString());
  
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Leadfeeder API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
  
    return response.json();
  }
  
  /**
   * Get date range for the last N days
   */
  export function getDateRange(days: number = 7): { startDate: string; endDate: string } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }
  
  /**
   * Fetch all leads with pagination
   */
  export async function fetchAllLeads(
    accountId: string,
    startDate: string,
    endDate: string,
    apiToken: string
  ): Promise<LeadfeederLead[]> {
    const allLeads: LeadfeederLead[] = [];
    let nextUrl: string | null = null;
    let isFirstRequest = true;

    do {
      const url = isFirstRequest
        ? `https://api.leadfeeder.com/accounts/${accountId}/leads?start_date=${startDate}&end_date=${endDate}&page[size]=100`
        : nextUrl;

      if (!url) break;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Leadfeeder API error: ${response.status}`);
      }

      const data: LeadfeederResponse = await response.json();
      allLeads.push(...data.data);

      nextUrl = data.links?.next || null;
      isFirstRequest = false;

      // Safety limit: max 10000 leads (Leadfeeder's limit)
      if (allLeads.length >= 10000) break;

    } while (nextUrl);

    return allLeads;
  }