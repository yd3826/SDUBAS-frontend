import {DataNode} from "antd/lib/tree";

interface map{
    [key:string]:any;
}
export const buildTree = (leafNodes:any) => {
    const tree:DataNode[] = [];

    // 构建节点路径映射表
    const pathMap:map = {};
    for (const node of leafNodes) {
        let { prefix } = node;
        if(prefix === null)
        {
            prefix = '/'
        }
         // 去除空字符串
        pathMap[prefix] = prefix.split('/').filter(Boolean);
    }

    // 遍历叶子节点，构建树
    for (const node of leafNodes) {
        const { prefix, id, name } = node;
        const path = pathMap[prefix];

        let currentLevel = tree;
        for (let i = 0; i < path.length; i++) {
            const key = path[i]+i;
            const existingNode = currentLevel.find(n => n.key === key);

            if (existingNode) {
                currentLevel = existingNode.children as DataNode[];
            } else {
                const newNode = {
                    title: path[i],
                    key:key,
                    children: [] as DataNode[]
                };
                currentLevel.push(newNode);
                currentLevel = newNode.children;
            }
        }

        // 添加叶子节点
        currentLevel.push({
            title:name,
            key: id,
            children: [] as DataNode[],
            isLeaf:true,
        });
    }

    return tree;
};