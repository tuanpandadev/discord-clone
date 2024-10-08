import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { serverId: string } }
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
    const { name, imageUrl } = await request.json();
    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (!params.serverId) {
      return NextResponse.json({ error: "Server ID Missing" }, { status: 400 });
    }

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { name, imageUrl }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { serverId: string } }
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
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
