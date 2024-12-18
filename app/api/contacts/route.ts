import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

// Define response types based on Loops API
interface LoopsResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
  };
  error?: string;
}

type ContactResponse = {
  success: boolean;
  contactId?: string;
  error?: string;
};

export async function POST(request: NextRequest) {
  const res = await request.json();
  const { email, properties, mailingLists } = res;

  try {
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Add transactional email
    await loops.sendTransactionalEmail({
      transactionalId: "cm4r12v6502b8chur8fe69x2r",
      email: email,
      dataVariables: properties || {}
    });

    const resp = await loops.updateContact(email, properties, mailingLists) as LoopsResponse;

    const response: ContactResponse = {
      success: resp.success,
      contactId: resp.success ? resp.data?.id : undefined,
      error: !resp.success ? resp.error : undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Loops API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update contact"
      },
      { status: 500 }
    );
  }
}
