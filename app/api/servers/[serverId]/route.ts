import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const { name, imageUrl } = await request.json();

    if (!name || !imageUrl) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { name, imageUrl }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
