// indiaData.ts

export const stateDistrictCityData: Record<string, Record<string, string[]>> = {
    AndhraPradesh: {
      Visakhapatnam: ['Gajuwaka', 'Madhurawada'],
      Vijayawada: ['Benz Circle', 'Poranki'],
    },
    ArunachalPradesh: {
      Tawang: ['Tawang Town'],
      Itanagar: ['Chimpu', 'Naharlagun'],
    },
    Assam: {
      Guwahati: ['Dispur', 'Paltan Bazaar'],
      Dibrugarh: ['Mohanbari', 'Barbari'],
    },
    Bihar: {
      Patna: ['Kankarbagh', 'Patliputra'],
      Gaya: ['Bodh Gaya', 'Civil Lines'],
    },
    Chhattisgarh: {
      Raipur: ['Pandri', 'Telibandha'],
      Bilaspur: ['Torwa', 'Mangla'],
    },
    Goa: {
      Panaji: ['Campal', 'Altinho'],
      Margao: ['Fatorda', 'Borda'],
    },
    Gujarat: {
      Ahmedabad: ['Navrangpura', 'Maninagar'],
      Surat: ['Adajan', 'Varachha'],
    },
    Haryana : {
        Kurukshetra: ['Babain St', 'Ismailabad St', 'Ladwa', 'Pehowa', 'Shahbad', 'Thanesar'],
        Ambala: ['Ambala City', 'Ambala Cantt', 'Barara', 'Mulana St', 'Naraingarh', 'Saha St', 'Shahzadpur St'],
        Bhiwani: ['Bahal St', 'Bawani Khera', 'Bhiwani', 'Loharu', 'Siwani', 'Tosham'],
        CharkhiDadri: ['Badhra', 'Bondkalan St', 'Dadri'],
        Faridabad: ['Badkhal', 'Ballabgarh', 'Dayalpur St', 'Dhauj St', 'Faridabad', 'Gaunchi St', 'Mohna St', 'Tigaon St'],
        Fatehabad: ['Bhattukalan St', 'Bhuna St', 'Fatehabad', 'Jakhal St', 'Kulan St', 'Ratia', 'Tohana'],
        Gurugram: ['Badshahpur St', 'Farrukhnagar', 'Gurgaon', 'Harsaru St', 'Kadipur St', 'Manesar', 'Pataudi', 'Sohna', 'Wazirabad St'],
        Hisar: [],
        Jhajjar: [],
        Jind: [],
        Kaithal: [],
        Karnal: [],
        Mahendragarh: [],
        Nuh: [],
        Palwal: [],
        Panchkula: [],
        Panipat: [],
        Rewari: [],
        Rohtak: [],
        Sirsa: [],
        Sonipat: [],
        Yamunanagar: ['Bilaspur', 'Chhachhrauli', 'Jagadhri', 'Pratap Nagar St', 'Radaur', 'Sadhaura St', 'Saraswati Nagar St'],
      },
    HimachalPradesh: {
      Shimla: ['Mall Road', 'Lakkar Bazaar'],
      Manali: ['Old Manali', 'Solang Valley'],
    },
    Jharkhand: {
      Ranchi: ['Kanke', 'Harmu'],
      Jamshedpur: ['Bistupur', 'Sakchi'],
    },
    Karnataka: {
      Bengaluru: ['Koramangala', 'Whitefield'],
      Mysuru: ['Gokulam', 'Chamundi Hill'],
    },
    Kerala: {
      Thiruvananthapuram: ['Kazhakoottam', 'Pattom'],
      Kochi: ['Ernakulam', 'Fort Kochi'],
    },
    MadhyaPradesh: {
      Bhopal: ['MP Nagar', 'Arera Colony'],
      Indore: ['Vijay Nagar', 'Rau'],
    },
    Maharashtra: {
      Mumbai: ['Bandra', 'Andheri'],
      Pune: ['Shivajinagar', 'Kothrud'],
    },
    Manipur: {
      Imphal: ['Lamphelpat', 'Uripok'],
      Churachandpur: ['Bazar Area'],
    },
    Meghalaya: {
      Shillong: ['Laitumkhrah', 'Police Bazaar'],
      Cherrapunji: ['Sohra'],
    },
    Mizoram: {
      Aizawl: ['Zarkawt', 'Chhinga Veng'],
      Lunglei: ['Bazar Veng', 'Chanmari'],
    },
    Nagaland: {
      Kohima: ['High School Area', 'Agri Colony'],
      Dimapur: ['Purana Bazaar', 'Chumukedima'],
    },
    Odisha: {
      Bhubaneswar: ['Saheed Nagar', 'Patia'],
      Cuttack: ['Buxi Bazaar', 'Choudhury Bazaar'],
    },
    Punjab: {
      Amritsar: ['Golden Temple Area', 'Ranjit Avenue'],
      Ludhiana: ['Sarabha Nagar', 'BRS Nagar'],
    },
    Rajasthan: {
      Jaipur: ['Malviya Nagar', 'Vaishali Nagar'],
      Udaipur: ['Fatehsagar', 'Hiran Magri'],
    },
    Sikkim: {
      Gangtok: ['MG Marg', 'Tadong'],
      Pelling: ['Lower Pelling', 'Upper Pelling'],
    },
    TamilNadu: {
      Chennai: ['T Nagar', 'Velachery'],
      Coimbatore: ['RS Puram', 'Gandhipuram'],
    },
    Telangana: {
      Hyderabad: ['Banjara Hills', 'Hitech City'],
      Warangal: ['Hanamkonda', 'Kazipet'],
    },
    Tripura: {
      Agartala: ['Krishnanagar', 'Banamalipur'],
      Udaipur: ['Matabari', 'Rajdharnagar'],
    },
    UttarPradesh: {
      Lucknow: ['Hazratganj', 'Gomti Nagar'],
      Varanasi: ['Assi Ghat', 'Lanka'],
    },
    Uttarakhand: {
      Dehradun: ['Rajpur Road', 'Clock Tower'],
      Haridwar: ['Har Ki Pauri', 'Jwalapur'],
    },
    WestBengal: {
      Kolkata: ['Salt Lake', 'New Town'],
      Darjeeling: ['Chowrasta', 'Ghoom'],
    },
    JammuAndKashmir: {
      Srinagar: ['Lal Chowk', 'Nishat'],
      Jammu: ['Gandhi Nagar', 'Bahu Plaza'],
    },
  };
  
  export const getStates = (): string[] => Object.keys(stateDistrictCityData);
  
  export const getDistricts = (state: string): string[] =>
    stateDistrictCityData[state] ? Object.keys(stateDistrictCityData[state]) : [];
  
  export const getCities = (state: string, district: string): string[] =>
    stateDistrictCityData[state]?.[district] || [];
  