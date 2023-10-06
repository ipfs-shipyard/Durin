package ai.protocol.ipfs.filforge

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.Fragment


class HomeFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {

        val rootView = inflater.inflate(R.layout.fragment_home, container)
        val cidField : EditText = rootView.findViewById(R.id.field_cid)
        val launchButton : Button = rootView.findViewById(R.id.btn_ipfs_intent)

        // TODO - add exception handling
        launchButton.setOnClickListener {
            // get the input
            val userInput = cidField.text.toString()
            // transform the input into a URL, get the fastest node
            val url = transform(userInput, getFastestNode())
            launchBrowser(url)
        }

        return rootView
    }

    // TODO add exception handling
    private fun launchBrowser(url : String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url));
        startActivity(intent);
    }
}