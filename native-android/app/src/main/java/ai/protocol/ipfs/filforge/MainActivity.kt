package ai.protocol.ipfs.java

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator

class MainActivity : AppCompatActivity() {


    private lateinit var viewPager: ViewPager2
    private lateinit var tabLayout: TabLayout

    val tableIcons = arrayOf(R.drawable.search, R.drawable.cloud_upload, R.drawable.settings)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Instantiate a ViewPager2 and a PagerAdapter.
        viewPager = findViewById(R.id.pager)
        viewPager.adapter = HomePagerAdapter(this)

        // tab layout
        tabLayout = findViewById(R.id.tablayout)

        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.setIcon(tableIcons[position])
        }.attach()
    }


    private inner class HomePagerAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {
        override fun getItemCount(): Int {
            return 3
        }

        override fun createFragment(position: Int): Fragment {
            return HomeFragment()
        }

    }
}