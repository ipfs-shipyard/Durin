import { Flex } from "react-flex-lite"
import { useNodes, open } from "../../util/ipfs"
import "./index.scss"

const defaultLinks = [
    { name: "Wikipedia", value: "ipns://en.wikipedia-on-ipfs.org" },
    { name: "PeerPad", value: "ipns://peerpad.net" },
    { name: "Uniswap", value: "ipns://app.uniswap.org" },
]

const ShortcutLinks: React.FC = () => {
    const { nodes } = useNodes()

    return (
        <>
            <h6>Shortcuts</h6>
            <Flex pt={1} className="shortcuts">
                {defaultLinks.map(({ name, value }) => (
                    <button key={value} onClick={() => open(value, nodes[0])}>
                        {name}
                    </button>
                ))}
            </Flex>
        </>
    )
}

export default ShortcutLinks
