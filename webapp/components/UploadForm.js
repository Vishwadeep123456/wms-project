export default function UploadForm() {
  return (
    <form method="POST" action="/api/upload" encType="multipart/form-data">
      <input type="file" name="sales_file" />
      <input type="submit" value="Upload Sales Data" />
    </form>
  );
}
