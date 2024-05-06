import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name } = body;

    const email = session?.user?.email!;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    const userId = users?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    console.log("Stores--", store);
    return NextResponse.json(store);
  } catch (error) {
    // console.log("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
