import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  _req: Request,
  {
    params
  }: {
    params: {
      serverId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        {
          status: 401
        }
      );
    }
    if (!params.serverId) {
      return NextResponse.json({ error: "Server ID Missing" }, { status: 400 });
    }
    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_INVITE_CODE]", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
