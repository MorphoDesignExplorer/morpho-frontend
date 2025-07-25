export function XHRFetch(
    file: File,
    progress: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void,
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const presignedUrlResponse = await fetch(
            `/auth/admin/project/new/presign/?mime=${file.type}`,
        );
        if (!presignedUrlResponse.ok) {
            reject(
                new Error("Unauthorized. Try logging out and logging back in."),
            );
        }

        const presignedUrl = (await presignedUrlResponse.json()) as {
            url: string;
            filename: string;
        };

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", progress, false);
        xhr.upload.addEventListener(
            "load",
            () => resolve(presignedUrl.filename),
            false,
        );
        xhr.upload.addEventListener(
            "error",
            (event) => {
                reject(event);
            },
            false,
        );
        xhr.open("PUT", presignedUrl.url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        const reader = new FileReader();
        reader.onload = (event) => {
            xhr.send(event.target?.result);
        };
        reader.readAsArrayBuffer(file);
    });
}
