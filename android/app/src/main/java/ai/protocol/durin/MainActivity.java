package ai.protocol.durin;

import com.getcapacitor.BridgeActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        String action = intent.getAction();
        String type = intent.getType();
        if (Intent.ACTION_SEND.equals(action) && type != null) {
            Bundle bundle = intent.getExtras();
            Uri fileUri = (Uri)bundle.get(Intent.EXTRA_STREAM);
            String encodedUri = Uri.encode(fileUri.toString());
            Uri uri = Uri.parse("ipfs://?url=" + encodedUri);
            Intent openViewIntent = new Intent(Intent.ACTION_VIEW, uri);
            openViewIntent.addCategory(Intent.CATEGORY_BROWSABLE);
            startActivity(openViewIntent);
            finish();
        }
    }

}
