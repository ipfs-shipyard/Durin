package ai.protocol.durin;

import com.getcapacitor.BridgeActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.database.Cursor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {

    public static void copyStreamToStream(InputStream in, OutputStream out) throws IOException {
        try (in) {
            try (out) {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            }
        }
    }

    @SuppressLint("Range")
    public String getFileName(Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        String action = intent.getAction();
        String type = intent.getType();
        if (Intent.ACTION_SEND.equals(action) && type != null) {
            Bundle bundle = intent.getExtras();
            Uri fileUri = (Uri)bundle.get(Intent.EXTRA_STREAM);
            String fileNameWithExtension = getFileName(fileUri);

            try {
                int lastDotInFileName = fileNameWithExtension.lastIndexOf('.');
                if (lastDotInFileName == -1) lastDotInFileName = fileNameWithExtension.length();
                String fileName = fileNameWithExtension.substring(0, lastDotInFileName);
                String extension = fileNameWithExtension.substring(lastDotInFileName, fileNameWithExtension.length());

                InputStream input = getContentResolver().openInputStream(fileUri);
                File tempFile = File.createTempFile(fileName,extension, this.getCacheDir());
                FileOutputStream output = new FileOutputStream(tempFile);
                copyStreamToStream(input, output);

                String encodedUri = Uri.encode(tempFile.toURI().toString());
                Uri uri = Uri.parse("durin://?url=" + encodedUri);
                Intent openViewIntent = new Intent(Intent.ACTION_VIEW, uri);
                openViewIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                startActivity(openViewIntent);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

}
