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
    private lateinit var autoNodeCircleCheck : View

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
        val rootView = inflater.inflate(R.layout.fragment_settings, container, false)
        autoNodeCircleCheck = rootView.findViewById<View>(R.id.circle_check)
        return rootView
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
        nodeListRecyclerView.setOnItemClickListener { _view, position ->
            // important - get the filtered node list from the adapter, not the original list
            // from the view model
            val node = (nodeListRecyclerView.adapter as? NodeListAdapter)?.getItem(position)
            node?.let {
                setPreferredGateway(requireContext(), it.host)
                (nodeListRecyclerView.adapter as? NodeListAdapter)?.notifyDataSetChanged()
                autoNodeCircleCheck.visibility = View.INVISIBLE
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

    private fun RecyclerView.setOnItemClickListener(onItemClickListener: (view: View, position: Int) -> Unit) {
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
