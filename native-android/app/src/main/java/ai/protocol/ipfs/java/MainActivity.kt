package ai.protocol.ipfs.java

import ai.protocol.ipfs.java.theme.DurinTheme
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource

// TODO - understand basic theming /w compose

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DurinTheme {
                // use a box to set our background image
                Box (modifier = Modifier.fillMaxSize()) {
                    Image(
                        painterResource(id = R.drawable.splash),
                        contentDescription = "",
                        contentScale = ContentScale.FillBounds,
                        modifier = Modifier.matchParentSize()
                    )
                }
                HelloWorld(name = "Jason")
            }
        }
    }

    @Composable
    fun HelloWorld(name : String) {
        Text(text = "Hello World $name")
    }
}