import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id!;

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findMany({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productsId: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name, price, categoryId, images, isFeatured, isArchived } = body;
    const userId = session?.user?.id!;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!images) {
      return new NextResponse("Image Url is Required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is Required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is Required", { status: 400 });
    }

    if (!params.productsId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("You are not authorized", { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: params.productsId,
      },
      data: {
        name,
        price,
        categoryId,
        images: {
          deleteMany: {},
        },
        isArchived,
        isFeatured,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productsId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productsId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id!;
    console.log("product id", params.productsId);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productsId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("You are not authorized", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productsId,
      },
    });
    console.log("product delete", product);
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
