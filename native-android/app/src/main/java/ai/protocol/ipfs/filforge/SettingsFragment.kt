package ai.protocol.ipfs.filforge

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SettingsFragment : Fragment() {

    private lateinit var viewModel: NodeViewModel


    private val handler = Handler(Looper.getMainLooper())
    private val runnable: Runnable = object : Runnable {
        override fun run() {
            // refresh the nodeList every 30 seconds
            viewModel.refresh()
            handler.postDelayed(this, 30000) // 60 seconds
        }
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel = ViewModelProvider(requireActivity()).get(NodeViewModel::class.java)
    }

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

        viewModel.getNodeList().observe(viewLifecycleOwner) { nodes ->
            val sortedHealthyNodes = nodes.filter { it.healthy }.sortedBy { it.speed }
            nodeListRecyclerView.adapter = NodeListAdapter(sortedHealthyNodes)
        }

        // add a click listener to the node list
        nodeListRecyclerView.setOnItemClickListener { view, position ->
            val node = viewModel.getNodeList().value?.get(position)
            if (node != null) {
                view.findViewById<View>(R.id.circle_check).visibility = View.VISIBLE
                // viewModel.setNode(node)
            }
        }

    }

    override fun onResume() {
        super.onResume()
        handler.postDelayed(runnable, 30000) // 30 seconds
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(runnable)
    }

    fun RecyclerView.setOnItemClickListener(onItemClickListener: (view: View, position: Int) -> Unit) {
        this.addOnChildAttachStateChangeListener(object: RecyclerView.OnChildAttachStateChangeListener {
            override fun onChildViewAttachedToWindow(view: View) {
                view.setOnClickListener {
                    val holder = getChildViewHolder(view)
                    onItemClickListener(view, holder.adapterPosition)
                }
            }

            override fun onChildViewDetachedFromWindow(view: View) {
                view.setOnClickListener(null)
            }
        })
    }


}
