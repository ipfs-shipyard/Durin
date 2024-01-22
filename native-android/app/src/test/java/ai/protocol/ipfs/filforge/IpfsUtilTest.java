package ai.protocol.ipfs.filforge;


import org.junit.Before;

import util.IpfsUtilsKt;

public class IpfsUtilTest {

    private Node node;

    @Before
    public void setUp() {
        node = new Node("dweb.link", true, true, true, null, null);
    }


}