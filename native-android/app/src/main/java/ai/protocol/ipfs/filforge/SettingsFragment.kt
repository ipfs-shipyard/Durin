package ai.protocol.ipfs.filforge

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SettingsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        super.onCreateView(inflater, container, savedInstanceState)

        return inflater.inflate(R.layout.fragment_settings, container, false)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val nodeListRecyclerView = view.findViewById<RecyclerView>(R.id.node_list_recycler_view)
        nodeListRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        val sortedHealthyNodes = nodeList.filter { it.healthy }.sortedBy { it.speed }
        nodeListRecyclerView.adapter = NodeListAdapter(sortedHealthyNodes)
    }


}
