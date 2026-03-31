export interface UploadedAdminAsset {
  url: string;
  publicId: string;
}

export async function uploadAdminFile(
  file: File,
  folder = "portfolio/misc"
): Promise<UploadedAdminAsset> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return {
    url: data.url,
    publicId: data.publicId,
  };
}
