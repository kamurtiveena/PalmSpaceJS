
const TechniqueType = {
    Unassigned: null,
    S2H_Relative: "S2H_Relative",
    S2H_Absolute: "S2H_Absolute",
    H2S_Relative: "H2S_Relative",
    H2S_Absolute: "H2S_Absolute",
    MidAir: "MidAir",
    FishEye: "FishEye",
    S2H_Relative_Finger: "S2H_Relative_Finger",
    H2S_Relative_Finger: "H2S_Relative_Finger",
    Landmark_Btn: "Landmark_Btn",
    Landmark_Btn_FishEye: "Landmark_Btn_FishEye",
    LayoutGrid: "LayoutGrid",
    LayoutFlow: "LayoutFlow"
}


const ReadingDirectionType = {
    Unassigned: null,
    LtoR: "LtoR",
    RtoL: "RtoL"
};


const PresentationType = {
    Unassigned: null,
    Existing: "Existing",
    Reordered: "Reordered",    
};

export {TechniqueType, ReadingDirectionType, PresentationType};