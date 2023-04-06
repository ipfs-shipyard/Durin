package ai.protocol.ipfs.java

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

// TODO - understand basic theming /w compose

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HelloWorld(name = "Jason")
        }
    }


    @Composable
    fun HelloWorld(name : String) {
        Text(text = "Hello World $name")
    }
}