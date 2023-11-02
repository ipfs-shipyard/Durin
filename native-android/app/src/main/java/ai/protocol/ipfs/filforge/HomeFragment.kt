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
import com.reallybadapps.ipfsrouter.getPreferredNode
import com.reallybadapps.ipfsrouter.transform


class HomeFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {

        val rootView = inflater.inflate(R.layout.fragment_home, container)
        val cidField : EditText = rootView.findViewById(R.id.field_cid)
        val launchButton : Button = rootView.findViewById(R.id.btn_ipfs_intent)

        // test value -> bafybeiagu4ioj5uzviif242wnyqsqoz7gryvfb72hhoot4wgco3rz7xxnq
        launchButton.setOnClickListener {
            // get the input
            val userInput = cidField.text.toString()
            // transform the input into a URL, get the fastest node
            val url = transform(userInput, getPreferredNode(requireContext()))
            launchBrowser(url)
        }

        return rootView
    }

    private fun launchBrowser(url : String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        startActivity(intent)
    }
}