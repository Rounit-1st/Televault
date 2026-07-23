const resolvePathToParent = async (path, ownerId) => {
    if (!path || path === "/") return null;

    const parts = path.split("/").filter(Boolean);

    let currentParent = null;

    for (const part of parts) {
        const folder = await File.findOne({
            name: part,
            parent: currentParent,
            owner: ownerId,
            type: "folder"
        });

        if (!folder) {
            throw new Error(`Folder "${part}" not found in path`);
        }

        currentParent = folder._id;
    }

    return currentParent;
};

resolvePathToParent("/folder1/folder2", "ownerId123")