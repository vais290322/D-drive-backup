import Service from "../Models/service.model.js";

// Create a new service
export const createService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json({ 
            success: true, 
            message: "Service created successfully", 
            data: newService 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all services
// export const getAllServices = async (req, res) => {
//     try {
//         const services = await Service.find();
//         res.status(200).json({ 
//             success: true, 
//             message: "Services retrieved successfully", 
//             data: services 
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// Get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 }); // Sort by creation date in descending order
        
        // Calculate tax amounts for each service
        const servicesWithCalculatedTaxes = services.map(service => {
            const serviceObj = service.toObject();
            
            // Calculate tax amounts based on percentages
            if (serviceObj.total) {
                const grossAmount = serviceObj.total.grossAmount || 0;
                
                // Calculate CGST amount if percentage exists
                if (serviceObj.total.cgst) {
                    const cgstPercentage = parseFloat(serviceObj.total.cgst.replace('%', '')) / 100;
                    serviceObj.total.cgstAmount = grossAmount * cgstPercentage;
                }
                
                // Calculate SGST amount if percentage exists
                if (serviceObj.total.sgst) {
                    const sgstPercentage = parseFloat(serviceObj.total.sgst.replace('%', '')) / 100;
                    serviceObj.total.sgstAmount = grossAmount * sgstPercentage;
                }
                
                // Calculate IGST amount if percentage exists
                if (serviceObj.total.igst) {
                    const igstPercentage = parseFloat(serviceObj.total.igst.replace('%', '')) / 100;
                    serviceObj.total.igstAmount = grossAmount * igstPercentage;
                }
            }
            
            return serviceObj;
        });
        
        res.status(200).json({ 
            success: true, 
            message: "Services retrieved successfully", 
            data: servicesWithCalculatedTaxes 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({ 
            success: true, 
            message: "Service retrieved successfully", 
            data: service 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a service by ID
export const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({ 
            success: true, 
            message: "Service updated successfully", 
            data: updatedService 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a service by ID
export const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({ 
            success: true, 
            message: "Service deleted successfully", 
            data: deletedService 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
