package ai.protocol.ipfs.filforge

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView


class NodeListAdapter(private val nodeList: List<Node>) : RecyclerView.Adapter<NodeListAdapter.NodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NodeViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_node, parent, false)
        return NodeViewHolder(view)
    }

    override fun getItemCount(): Int {
        return nodeList.size
    }

    override fun onBindViewHolder(holder: NodeViewHolder, position: Int) {
        val currentNode = nodeList[position]
        holder.nodeTextView.text = currentNode.host + " - " + currentNode.speed + " ms"
    }

    inner class NodeViewHolder(itemView : View) : RecyclerView.ViewHolder(itemView) {
        val nodeTextView: TextView = itemView.findViewById<TextView>(R.id.node_text)
    }


}
