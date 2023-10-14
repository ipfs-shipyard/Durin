package ai.protocol.ipfs.filforge

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class NodeViewModel : ViewModel() {

    private val _nodes = MutableLiveData<List<Node>>()
    private val nodes: LiveData<List<Node>> get() = _nodes

    init {
        viewModelScope.launch(Dispatchers.IO) {
            nodeCheck { nodes ->
                launch(Dispatchers.Main) {
                    setNodes(nodes)
                }
            }
        }
    }

    private fun setNodes(nodeList: List<Node>) {
        _nodes.value = nodeList
    }

    fun getNodeList(): LiveData<List<Node>> {
        return nodes
    }
}
