import GroupName from "../Models/group.model.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { groupName, description } = req.body;

    // Check if group already exists
    const existingGroup = await GroupName.findOne({ groupName });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group with this name already exists",
      });
    }

    // Create new group
    const group = await GroupName.create({
      groupName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating group",
      error: error.message,
    });
  }
};

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await GroupName.find();

    if (groups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No groups found",
      });
    }

    return res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching groups",
      error: error.message,
    });
  }
};

// Get a single group by ID
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await GroupName.findById(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching group",
      error: error.message,
    });
  }
};

// Update a group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName, description } = req.body;

    // Check if the new group name already exists (but not for the current group)
    if (groupName) {
      const existingGroup = await GroupName.findOne({ 
        groupName, 
        _id: { $ne: id } 
      });
      
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: "Group with this name already exists",
        });
      }
    }

    const updatedGroup = await GroupName.findByIdAndUpdate(
      id,
      { groupName, description },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating group",
      error: error.message,
    });
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGroup = await GroupName.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting group",
      error: error.message,
    });
  }
};