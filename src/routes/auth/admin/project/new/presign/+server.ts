import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime";

async function createPresignedUrlWithClient(
    region: string,
    bucket: string,
    key: string,
): Promise<string> {
    const client = new S3Client({ region });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 }); // link is valid for one hour.
}

export const GET = async ({ locals, url }) => {
    if (O.isNone(locals.user)) {
        return new Response("Unauthenticated", { status: 401 });
    }

    const ext = mime.getExtension(url.searchParams.get("mime") || "");

    const randomFilename =
        "upload-" + crypto.randomUUID() + (ext ? "." + ext : "");

    return new Response(
        JSON.stringify({
            url: await createPresignedUrlWithClient(
                "us-east-1",
                "morpho-temp",
                randomFilename,
            ),
            filename: randomFilename,
        }),
    );
};
