import { json, redirect } from '@sveltejs/kit'
import { Option as O } from "effect";

import {
    PutObjectCommand,
    S3Client,
    S3ServiceException
} from '@aws-sdk/client-s3'
import mime from "mime";

export async function POST({ locals, request }) {
    if (O.isNone(locals.user)) {
        return new Response("Unauthenticated", { status: 401 });
    }

    const formdata = await request.formData()
    const img = formdata.get("image") as File | null
    if (img) {
        const client = new S3Client({});

        const key = `user-upload/${crypto.randomUUID()}.${mime.getExtension(img.type)}`;
        const command = new PutObjectCommand({
            Bucket: "morpho-images",
            Key: key,
            Body: Buffer.from(await img.arrayBuffer()),
            ContentType: img.type
        })

        try {
            console.log(`started upload of ${key}`)
            const response = await client.send(command);
            if (response) {
                return json({imgurl: key}, {status: 200})
            }
        } catch (caught) {
            if (caught instanceof S3ServiceException && caught.name === "EntityTooLarge") {
                console.error(
                  `Error from S3 while uploading object to morpho-images. \
                  The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
                  or the multipart upload API (5TB max).`,
                );
                return json({message: "object too large."}, {status: 400})
            } else if (caught instanceof S3ServiceException) {
                console.error(
                    `Error from S3 while uploading object to morpho-images.  ${caught.name}: ${caught.message}`,
                );
                return json({message: "Internal error."}, {status: 500})
            } else {
                console.error(caught)
                return json({message: "Internal error."}, {status: 500})
            }
        }
    }
}
