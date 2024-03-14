
const getPartnerInfo = ( participants, email ) => {
    return participants.find(p => p?.email !== email)

};

export default getPartnerInfo;