package ai.protocol.ipfs.java;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import io.ipfs.cid.Cid;

public class HomeFragment extends Fragment {

    private EditText cidField;
    private Button launchButton;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_home, container);

        cidField = rootView.findViewById(R.id.field_cid);
        launchButton = rootView.findViewById(R.id.btn_ipfs_intent);

        launchButton.setOnClickListener((view) -> {
            String userInput = cidField.getText().toString();

            try { ;
                Intent i = new Intent();
                i.setAction(Intent.ACTION_VIEW);
                Uri uri = Uri.parse(userInput);

                String scheme = uri.getScheme();
                if (!scheme.equals("ipfs") && !scheme.equals("ipns")) {
                    Toast.makeText(requireContext(), "Scheme must be ipfs:// or ipns://", Toast.LENGTH_LONG).show();
                    return;
                }

                // quick sanity check on the CID, will throw exceptions if there's an issue
                Cid.decode(uri.getAuthority());

                i.setData(uri);
                startActivity(i);
            }
            catch (RuntimeException exception) {
                Toast.makeText(requireContext(), "Invalid CID: " + exception.getMessage(), Toast.LENGTH_LONG).show();
            }
        });

        return rootView;
    }


}