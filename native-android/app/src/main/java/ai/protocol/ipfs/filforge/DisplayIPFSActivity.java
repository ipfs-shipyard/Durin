package ai.protocol.ipfs.java;

import androidx.appcompat.app.AppCompatActivity;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class DisplayIPFSActivity extends AppCompatActivity {

    private Uri ipfsURI;
    private WebView webView;

    public static final String GATEWAY = "https://%1$s.ipfs.dweb.link/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_ipfsactivity);
        ipfsURI = getIntent().getData();
        webView = findViewById(R.id.ipfs_webview);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.loadUrl(translateIPFStoDWeb(ipfsURI));
    }

    public static String translateIPFStoDWeb(Uri link) {
        return String.format(GATEWAY, link.getAuthority());
    }
}