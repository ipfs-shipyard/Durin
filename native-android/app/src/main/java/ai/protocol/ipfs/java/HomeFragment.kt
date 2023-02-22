package ai.protocol.ipfs.java

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.compose.material3.Text
import androidx.fragment.app.Fragment
import io.ipfs.cid.Cid
import androidx.compose.runtime.Composable


class HomeFragment : Fragment() {
    // private var cidField: EditText? = null
    // private var launchButton: Button? = null

    // TODO - using Jetpack Compose in a fragment.

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
//
//        val rootView = inflater.inflate(R.layout.fragment_home, container)
//        cidField = rootView.findViewById(R.id.field_cid)
//        launchButton = rootView.findViewById(R.id.btn_ipfs_intent)
//        launchButton.setOnClickListener(View.OnClickListener { view: View? ->
//            val userInput = cidField.getText().toString()
//            try {
//                val i = Intent()
//                i.action = Intent.ACTION_VIEW
//                val uri = Uri.parse(userInput)
//                val scheme = uri.scheme
//                if (scheme != "ipfs" && scheme != "ipns") {
//                    Toast.makeText(requireContext(), "Scheme must be ipfs:// or ipns://", Toast.LENGTH_LONG).show()
//                    return@setOnClickListener
//                }
//
//                // quick sanity check on the CID, will throw exceptions if there's an issue
//                Cid.decode(uri.authority)
//                i.data = uri
//                startActivity(i)
//            } catch (exception: RuntimeException) {
//                Toast.makeText(requireContext(), "Invalid CID: " + exception.message, Toast.LENGTH_LONG).show()
//            }
//        })
         return View(context)
    }

    @Composable
    fun HelloWorld() {
        Text(text = "Hello World")
    }

}