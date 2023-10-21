package ai.protocol.ipfs.filforge

import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.GestureDetector
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
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
        nodeListRecyclerView.addOnItemTouchListener(
            RecyclerItemClickListener(
                requireContext(),
                nodeListRecyclerView,
                object : RecyclerItemClickListener.OnItemClickListener {
                    override fun onItemClick(view: View, position: Int) {
                        val nodeList = viewModel.getNodeList().value
                        if (nodeList != null) {
                            val node = nodeList[position]
                            view.findViewById<ImageView>(R.id.circle_check).visibility = View.VISIBLE
                        }
                    }
                })
        )
    }

    override fun onResume() {
        super.onResume()
        handler.postDelayed(runnable, 30000) // 30 seconds
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(runnable)
    }

}

class RecyclerItemClickListener(
    context: Context,
    recyclerView: RecyclerView,
    private val mListener: OnItemClickListener?
) : RecyclerView.OnItemTouchListener {

    private val mGestureDetector: GestureDetector

    init {
        mGestureDetector = GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
            override fun onSingleTapUp(e: MotionEvent): Boolean {
                return true
            }
        })
    }

    override fun onInterceptTouchEvent(view: RecyclerView, e: MotionEvent): Boolean {
        val childView = view.findChildViewUnder(e.x, e.y)
        if (childView != null && mListener != null && mGestureDetector.onTouchEvent(e)) {
            mListener.onItemClick(childView, view.getChildAdapterPosition(childView))
            return true
        }
        return false
    }

    override fun onTouchEvent(view: RecyclerView, motionEvent: MotionEvent) {}

    override fun onRequestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {}

    interface OnItemClickListener {
        fun onItemClick(view: View, position: Int)
    }
}
