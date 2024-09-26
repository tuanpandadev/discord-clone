import { NextResponse } from "next/server";

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
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id
        },
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_LEAVE]", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
