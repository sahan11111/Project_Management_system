import ErrorHandler from "../middlewares/error.js";
import { SupervisorRequest } from "../models/supervisorRequest.js";

export const createRequest = async (requestData) => {
    const existingRequest = await SupervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "pending",
    });

    if (existingRequest) {
        throw new ErrorHandler("Request already exists. Please wait for the previous request to be processed.", 400);
    }

    const request = await SupervisorRequest.create(requestData);
    return await request.save();    
};


// import { SupervisorRequest } from "../models/supervisorRequest.js";

// export const createRequest = async (requestData) => {
//     const existingRequest = await SupervisorRequest.findOne({
//         student: requestData.student,
//         supervisor: requestData.supervisor,
//         status: "pending",
//     });

//     if (existingRequest) {
//         return {
//             request: existingRequest,
//             isExisting: true,
//         };
//     }

//     const request = await SupervisorRequest.create(requestData);
//     return {
//         request: await request.save(),
//         isExisting: false,
//     };
// };