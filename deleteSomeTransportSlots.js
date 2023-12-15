require('./database/connection')
const TransportSlot = require('./database/models/transport/transportSlots');

async function deleteFirst10Documents() {
    try {
      // Fetch the first 10 documents
      const documentsToDelete = await TransportSlot.find({}).limit(10000);
  
      // Delete the fetched documents
      await TransportSlot.deleteMany({ _id: { $in: documentsToDelete.map(doc => doc._id) } });
  
      console.log('Done');
    } catch (err) {
      console.error(err);
    }
  }
  
  // Call the function to delete the first 10 documents
  deleteFirst10Documents();