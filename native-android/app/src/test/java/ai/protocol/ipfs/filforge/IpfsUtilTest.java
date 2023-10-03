package ai.protocol.ipfs.filforge;


import org.junit.Before;
import org.junit.Test;
import util.Node;
import static org.junit.Assert.*;

import util.IpfsUtilsKt;

public class IpfsUtilTest {

    private Node node;

    @Before
    public void setUp() {
        node = new Node("dweb.link", true, true, true, null, null);
    }


}