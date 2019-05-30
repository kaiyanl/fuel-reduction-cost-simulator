//Input variables
let e, inputElements, cut_type, system, Slope, elevation, machine, load_cost, area, move_in_dist,
    CalcMoveIn, CalcResidues;
//Input variables
let UserSpecWDCT, UserSpecWDSLT, UserSpecWDLLT,
    UserSpecRFCT, UserSpecRFSLT, UserSpecRFLLT,
    UserSpecHFCT, UserSpecHFSLT, UserSpecHFLLT;
//Intermediate variables except the first line that is consisted of all input variables
let RemovalsCT, RemovalsSLT, RemovalsLLT, TreeVolCT, TreeVolSLT, TreeVolLLT,
    RemovalsST, RemovalsALT, Removals, TreeVolST, TreeVolALT, TreeVol,
    VolPerAcreCT, VolPerAcreSLT, VolPerAcreLLT, VolPerAcreST, VolPerAcreALT, VolPerAcre,
    DBHCT, DBHSLT, DBHLLT, DBHST, DBHALT, DBH, HeightCT, HeightSLT, HeightLLT, HeightST, HeightALT, Height,
    WoodDensityCT, WoodDensitySLT, WoodDensityLLT, WoodDensityST, WoodDensityALT, WoodDensity,
    HdwdFractionCT, HdwdFractionSLT, HdwdFractionLLT, HdwdFractionST, HdwdFractionALT, HdwdFraction,
    ButtDiamSLT,ButtDiamST,ButtDiam,
    LogsPerTreeCT, LogsPerTreeSLT, LogsPerTreeLLT, LogsPerTreeST, LogsPerTreeALT, LogsPerTree,
    LogVolST, LogVolALT, LogVol, CTLLogsPerTreeCT, CTLLogsPerTree, CTLLogVolCT, CTLLogVol,
    BoleWtCT, BoleWtSLT, BoleWtLLT, BoleWtST, BoleWtALT, BoleWt,
    ResidueCT, ResidueSLT, ResidueLLT, ResidueST, ResidueALT, Residue,
    ManualMachineSizeALT, ManualMachineSize, MechMachineSize, ChipperSize, NonSelfLevelCabDummy,
    CSlopeFB_Harv, CRemovalsFB_Harv, CSlopeSkidForwLoadSize,
    CHardwoodCT, CHardwoodSLT, CHardwoodLLT, CHardwoodST, CHardwoodALT, CHardwood;
//Output variables
let BoleVolCCF, ResidueRecoveredPrimary, PrimaryProduct, ResidueRecoveredOptional,
    TotalPrimaryAndOptional, TotalPrimaryProductsAndOptionalResidues,
    GroundFuel, PiledFuel, ResidueUncutTrees, TotalResidues, Movein4PrimaryProduct, OntoTruck4ResiduesWoMovein,
    ChipLooseResiduesFromLogTreesLess80cf, FellAndBunchTreesLess80cf, ManualFellLimbBuckTreesLarger80cf,
    SkidBunchedAllTrees, ProcessLogTreesLess80cf, LoadLogTrees, ChipWholeTrees, Stump2Truck4PrimaryProductWithoutMovein,
    TotalPerAcre, TotalPerBoleCCF, TotalPerGT;
//Assumption variables
// var MaxManualTreeVol, MaxMechTreeVol, MoistureContentFraction, LogLength, LoadWeightLog, LoadWeightChip,
//     CTLTrailSpacing, HdwdCostPremium, ResidueRecovFracWT, ResidueRecovFracCTL;
//test purpose
// var outputText, outputText2, outputText3;
// var DieselPrice = 3.327;
function calculate(){
    // get the harvesting system
    e = document.getElementById("system");
    system = e.options[e.selectedIndex].text;

    //if clear_cut, cut_type = 0; otherwise 1. 
    if (document.getElementById("cut_type").value === "clear_cut"){
        cut_type = 0; 
    } else {
        cut_type = 1;
    }
    //get yarding distance, percent_slope; and elevation for helicopter systems
    deliver_dist = Number(document.getElementById("deliver_dist").value);
    Slope = Number(document.getElementById("slope").value);
    elevation = Number(document.getElementById("elevation").value);

    // get the harvesting system
    e = document.getElementById("machine");
    machine = e.options[e.selectedIndex].text;

    //if include loading costs, load_cost=1; otherwise 0.
    inputElements = document.getElementsByClassName('load_cost');
    if(inputElements[0].checked){
        load_cost = 1;
    } else {
        load_cost = 0;
    }

    //if include move-in costs
    inputElements = document.getElementsByClassName('move_in');
    if(inputElements[0].checked){
        CalcMoveIn = 1;
    } else {
        CalcMoveIn = 0;
    }
    //area treated and one-way move-in distance are needed when movein_cost is checked.
    area = document.getElementById("area").value;
    move_in_dist = document.getElementById("move_in_dist").value;

    //if include the costs of collecting and chipping residues
    inputElements = document.getElementsByClassName('residue_collect');
    if(inputElements[0].checked){
        CalcResidues = 1;
    } else {
        alert("CalcResidues not checked");
        CalcResidues = 0;
    }

    //Other Assumptions --hardcoded--
    let MaxManualTreeVol = 150;
    let MaxMechTreeVol=80;
    let MoistureContentFraction=0.50;
    let LogLength=32;
    let LoadWeightLog=25;
    let LoadWeightChip=25;
    let CTLTrailSpacing=50;
    let HdwdCostPremium=0.20;
    let ResidueRecovFracWT=0.80;
    let ResidueRecovFracCTL=0.50;

    //get values of Green wood density, Residue Fraction and Hardwood Fraction
    //ct: chip trees; slt: small log trees; llt: large log trees; rm: removals; tv: tree volume;
    //gwd: green wood density; rf: residue fraction; hf: hardwood fraction
    UserSpecWDCT = Number(document.getElementById("gwd_ct").value); // green wood density of chip trees
    UserSpecWDSLT = Number(document.getElementById("gwd_slt").value); 
    UserSpecWDLLT = Number(document.getElementById("gwd_llt").value);
    UserSpecRFCT = Number(document.getElementById("rf_ct").value); 
    UserSpecRFSLT = Number(document.getElementById("rf_slt").value); // residue fraction of small log trees
    UserSpecRFLLT = Number(document.getElementById("rf_llt").value);
    UserSpecHFCT = Number(document.getElementById("hf_ct").value); 
    UserSpecHFSLT = Number(document.getElementById("hf_slt").value);
    UserSpecHFLLT = Number(document.getElementById("hf_llt").value); // hardwood fraction of large log trees

    RemovalsCT = Number(document.getElementById("rmct").value); // removals of chip trees
    RemovalsSLT = Number(document.getElementById("rmslt").value); 
    RemovalsLLT = Number(document.getElementById("rmllt").value); 
    TreeVolCT =  Number(document.getElementById("tvct").value); 
    TreeVolSLT =  Number(document.getElementById("tvslt").value); // tree volume of small log trees
    TreeVolLLT =  Number(document.getElementById("tvllt").value);
//funtions
    RemovalsST = RemovalsCT + RemovalsSLT;
    RemovalsALT = RemovalsSLT + RemovalsLLT;
    Removals = RemovalsCT + RemovalsSLT + RemovalsLLT;

    VolPerAcreCT = RemovalsCT * TreeVolCT;
    VolPerAcreSLT = RemovalsSLT * TreeVolSLT;
    VolPerAcreLLT = RemovalsLLT * TreeVolLLT;
    VolPerAcreST = VolPerAcreCT + VolPerAcreSLT;
    VolPerAcreALT = VolPerAcreSLT + VolPerAcreLLT;
    VolPerAcre = VolPerAcreCT + VolPerAcreSLT + VolPerAcreLLT;

    TreeVolST = RemovalsST>0 ? VolPerAcreST/RemovalsST : 0;
    TreeVolALT = RemovalsALT>0 ? VolPerAcreALT/RemovalsALT : 0;
    TreeVol = Removals>0 ? VolPerAcre/Removals : 0;

//DBH
    DBHCT = Math.sqrt((TreeVolCT+3.675)/0.216);
    DBHSLT = Math.sqrt((TreeVolSLT+3.675)/0.216);
    DBHLLT = Math.sqrt((TreeVolLLT+3.675)/0.216);
    DBHST = TreeVolST>0 ? Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsSLT*Math.pow(DBHSLT,2))/RemovalsST) : 0;
    DBHALT = TreeVolALT>0 ? Math.sqrt((RemovalsSLT*Math.pow(DBHSLT,2)+RemovalsLLT*Math.pow(DBHLLT,2))/RemovalsALT) : 0;
    DBH= Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsALT*Math.pow(DBHALT,2))/Removals);
//Tree Height
    HeightCT=TreeVolCT>0?-20+24*Math.sqrt(DBHCT):0;
    HeightSLT=TreeVolSLT>0?-20+24*Math.sqrt(DBHSLT):0;
    HeightLLT=TreeVolLLT>0?-20+24*Math.sqrt(DBHLLT):0;
    HeightST = TreeVolST>0?(RemovalsCT*HeightCT+RemovalsSLT*HeightSLT)/RemovalsST:0;
    HeightALT = TreeVolALT>0?(RemovalsSLT*HeightSLT+RemovalsLLT*HeightLLT)/RemovalsALT:0;
    Height = TreeVol>0?(RemovalsCT*HeightCT+RemovalsALT*HeightALT)/Removals:0;
//Wood Density
    WoodDensityCT =UserSpecWDCT>0?UserSpecWDCT:50;
    WoodDensitySLT =UserSpecWDSLT>0?UserSpecWDSLT:50;
    WoodDensityLLT =UserSpecWDLLT>0?UserSpecWDLLT:50;
    WoodDensityST =VolPerAcreST>0?(WoodDensityCT*VolPerAcreCT+WoodDensitySLT*VolPerAcreSLT)/VolPerAcreST:0;
    WoodDensityALT =VolPerAcreALT>0?(WoodDensitySLT*VolPerAcreSLT+WoodDensityLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    WoodDensity =(WoodDensityCT*VolPerAcreCT+WoodDensityALT*VolPerAcreALT)/VolPerAcre;
//Hardwood Fraction
    HdwdFractionCT  = !isNaN(UserSpecHFCT) ? UserSpecHFCT:0;
    HdwdFractionSLT = !isNaN(UserSpecHFSLT) ? UserSpecHFSLT:0;
    HdwdFractionLLT = !isNaN(UserSpecHFLLT) ? UserSpecHFLLT:0;
    HdwdFractionST = VolPerAcreST>0?(HdwdFractionCT*VolPerAcreCT+HdwdFractionSLT*VolPerAcreSLT)/VolPerAcreST:0;
    HdwdFractionALT =VolPerAcreALT>0?(HdwdFractionSLT*VolPerAcreSLT+HdwdFractionLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    HdwdFraction =(HdwdFractionCT*VolPerAcreCT+HdwdFractionALT*VolPerAcreALT)/VolPerAcre;
//ButtDiam
    ButtDiamSLT=DBHSLT+3;
    ButtDiamST=DBHST+3;
    ButtDiam=DBH+3;
//Logs Per Tree
    LogsPerTreeCT = 1;
    LogsPerTreeSLT= (-0.43+0.678*Math.sqrt(DBHSLT));
    LogsPerTreeLLT= (-0.43+0.678*Math.sqrt(DBHLLT));
    LogsPerTreeST =(LogsPerTreeCT*RemovalsCT+LogsPerTreeSLT*RemovalsSLT)/RemovalsST;
    LogsPerTreeALT =RemovalsALT===0?0:((LogsPerTreeSLT*RemovalsSLT+LogsPerTreeLLT*RemovalsLLT)/RemovalsALT);
    LogsPerTree =(LogsPerTreeCT*RemovalsCT+LogsPerTreeALT*RemovalsALT)/Removals;
//Log Volume
    LogVolST =TreeVolST/LogsPerTreeST;
    LogVolALT = RemovalsALT===0?0:TreeVolALT/LogsPerTreeALT;
    LogVol =TreeVol/LogsPerTree;
//CTL Logs Per Tree
    CTLLogsPerTreeCT= Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHCT)));
    CTLLogsPerTree=Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHST)));
// CTL Log Volume
    CTLLogVolCT=TreeVolCT/CTLLogsPerTreeCT;
    CTLLogVol=TreeVolST/CTLLogsPerTree;
//BFperCF=5
    let BFperCF=5;
//Bole Weight
    BoleWtCT =WoodDensityCT*VolPerAcreCT/2000;
    BoleWtSLT =WoodDensitySLT*VolPerAcreSLT/2000;
    BoleWtLLT =WoodDensityLLT*VolPerAcreLLT/2000;
    BoleWtST =BoleWtCT+BoleWtSLT;
    BoleWtALT =BoleWtSLT+BoleWtLLT;
    BoleWt =BoleWtCT+BoleWtALT;
//Residue Weight
    ResidueCT =UserSpecRFCT*BoleWtCT;
    ResidueSLT =UserSpecRFSLT*BoleWtSLT;
    ResidueLLT =UserSpecRFLLT*BoleWtLLT;
    ResidueST =ResidueCT+ResidueSLT;
    ResidueALT =ResidueSLT+ResidueLLT;
    Residue =ResidueCT+ResidueALT;
// Manual Machine Size
    ManualMachineSizeALT=Math.min(1,TreeVolALT/MaxManualTreeVol);
    ManualMachineSize=Math.min(1,TreeVol/MaxManualTreeVol);
//Mechanized Machine Size 
    MechMachineSize=Math.min(1,TreeVolST/MaxMechTreeVol);
//Chipper Size
    ChipperSize=Math.min(1,TreeVolCT/MaxMechTreeVol);
//NonSelfLevelCabDummy
    NonSelfLevelCabDummy=Slope<15?1:(Slope<35?1.75-0.05*Slope:0);
//CSlopeFB&Harv (Mellgren 90)
    CSlopeFB_Harv =0.00015*Math.pow(Slope,2)+0.00359*NonSelfLevelCabDummy*Slope;
//CRemovalsFB&Harv (Mellgren 90)
    CRemovalsFB_Harv =Math.max(0,0.66-0.001193*RemovalsST*2.47+5.357*Math.pow(10,-7)*Math.pow(RemovalsST*2.47,2));
//CSlopeSkidForwLoadSize (Mellgren 90)
    CSlopeSkidForwLoadSize =1-0.000127*Math.pow(Slope,2);
//Chardwood
    CHardwoodCT =1+HdwdCostPremium*HdwdFractionCT;
    CHardwoodSLT =1+HdwdCostPremium*HdwdFractionSLT;
    CHardwoodLLT =1+HdwdCostPremium*HdwdFractionLLT;
    CHardwoodST =1+HdwdCostPremium*HdwdFractionST;
    CHardwoodALT =1+HdwdCostPremium*HdwdFractionALT;
    CHardwood =1+HdwdCostPremium*HdwdFraction;

//------------------------------------------ output --------------------------------------------------------------------
// ----System Product Summary--------------
// Amounts Recovered Per Acre
    BoleVolCCF=VolPerAcre/100;
    ResidueRecoveredPrimary=ResidueRecovFracWT*ResidueCT;
    PrimaryProduct=BoleWt+ ResidueRecoveredPrimary;
    ResidueRecoveredOptional = CalcResidues===1?(ResidueRecovFracWT*ResidueSLT)+(ResidueRecovFracWT*ResidueLLT):0;
    TotalPrimaryAndOptional=PrimaryProduct + ResidueRecoveredOptional;
    TotalPrimaryProductsAndOptionalResidues=PrimaryProduct+ResidueRecoveredOptional;
// Amounts Unrecovered and Left within the Stand Per Acre
    GroundFuel=ResidueLLT+ResidueST*(1-ResidueRecovFracWT);
// Amounts Unrecovered and Left at the Landing
    PiledFuel=CalcResidues===1?0:ResidueSLT*ResidueRecovFracWT;
// TotalResidues
    ResidueUncutTrees=0;
    TotalResidues=ResidueRecoveredPrimary+ResidueRecoveredOptional+ResidueUncutTrees+GroundFuel+PiledFuel;
// System Cost Elements-------
// For Primary Products (boles & WT residues), $/CCF of material treated by the activity

// For Optional Residues, $/GT of additional residue recovered
// Chip Loose Residues: from log trees <=80 cf
// =CostChipLooseRes*CollectOption*InLimits1
// Residue Move-In Costs, $/GT = =0*CalcMoveIn*CalcResidues*InLimits1

// For All Products, $/ac--

/*---------hardcoded-----------*/ //Todo: Find the equations for var below
    let TreesPerCycleIIB;
    let CostFellBunch=FellBunch(Slope,RemovalsST,TreeVolST,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST);
    let CostManFLBLLT=FellLargeLogTrees(Slope,RemovalsLLT,TreeVolLLT,cut_type,DBHLLT,LogsPerTreeLLT);
    let CostSkidBun= Skidding(Slope,deliver_dist,Removals,TreeVol,WoodDensity,LogLength,cut_type,CSlopeSkidForwLoadSize,LogsPerTree,LogVol,ManualMachineSize,BFperCF,ButtDiam);
    let CostProcess=8.18;
    let CostLoad=7.78;
    let CostChipWT=7.76;
    let MoveInCosts1G39=79.06;
    let CostChipLooseRes=7.37;
    let InLimits1=1; 
/*---------hardcoded-----------*/

    ChipLooseResiduesFromLogTreesLess80cf=CostChipLooseRes*CalcResidues*ResidueRecoveredOptional*InLimits1;
    FellAndBunchTreesLess80cf=CostFellBunch*VolPerAcreST/100*InLimits1;
    ManualFellLimbBuckTreesLarger80cf=CostManFLBLLT*VolPerAcreLLT/100*InLimits1;
    SkidBunchedAllTrees=CostSkidBun*VolPerAcre/100*InLimits1;
    ProcessLogTreesLess80cf=CostProcess*VolPerAcreSLT/100*InLimits1;
    LoadLogTrees=CostLoad*VolPerAcreALT/100*InLimits1;
    ChipWholeTrees=CostChipWT*VolPerAcreCT/100*InLimits1;
    Stump2Truck4PrimaryProductWithoutMovein=FellAndBunchTreesLess80cf+ManualFellLimbBuckTreesLarger80cf+SkidBunchedAllTrees+ProcessLogTreesLess80cf+LoadLogTrees+ChipWholeTrees;
    Movein4PrimaryProduct=MoveInCosts1G39*CalcMoveIn*BoleVolCCF*InLimits1;
    OntoTruck4ResiduesWoMovein=ChipLooseResiduesFromLogTreesLess80cf; //for Mech WT sys;
    let Movein4Residues=0; // Movein4Residues=0*CalcMoveIn*CalcResidues*ResidueRecoveredOptional*InLimits1;

//Results 
    TotalPerAcre=Stump2Truck4PrimaryProductWithoutMovein+Movein4PrimaryProduct+OntoTruck4ResiduesWoMovein+Movein4Residues;
    TotalPerBoleCCF=TotalPerAcre/BoleVolCCF;
    TotalPerGT=TotalPerAcre/TotalPrimaryProductsAndOptionalResidues;

    document.getElementById("CCF").textContent = Math.round(TotalPerBoleCCF).toString();
    document.getElementById("Ton").textContent = Math.round(TotalPerGT).toString();
    document.getElementById("Acre").textContent = Math.round(TotalPerAcre).toString();

// highlight outputs color
    // let output = document.getElementsByClassName("output");
    // output[0].style.background="yellow";
    // for (let i = 0; i < output.length; i++) {
    //     output[i].style.background = "yellow";
    // }
    
// test
//     let a=FellBunch(Slope,RemovalsST,TreeVolST,cut_type,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv);
    // var a=Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsSLT*Math.pow(DBHSLT,2))/RemovalsST);
    // outputText= CostSkidBun; //2.0
    // document.getElementById("output_text").textContent = outputText;
    // outputText2=a;
    // document.getElementById("output_text2").textContent = outputText2;
    // outputText3=TimePerAccumIIG;
    // document.getElementById("output_text3").textContent = outputText3;
    // outputText4=NonSelfLevelCabDummy;
    // document.getElementById("output_text4").textContent = outputText4;
    // outputText5=DBHSLT;
    // document.getElementById("output_text5").textContent = outputText5;
    // outputText6=;
    // document.getElementById("output_text6").textContent = outputText6;
}

/**
 * @return {number}
 */
function FellBunch(Slope,RemovalsST,TreeVolST,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST){
    //IA Melroe Bobcat (Johnson, 79) //FellBunch(Slope,RemovalsST,TreeVolST,cut_type,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST);
    let DistBetweenTrees,TimePerTreeIA,VolPerPMHIA,CostPerPMHIA,CostPerCCFIA,RelevanceIA;
    //IB Chainsaw Heads
    let TimePerTreeIB,VolPerPMHIB,CostPerPMHIB,CostPerCCFIB,RelevanceIB;
    //IC Intermittent Circular Sawheads
    let TimePerTreeIC,VolPerPMHIC,CostPerPMHIC,CostPerCCFIC,RelevanceIC;
    //ID Hydro-Ax 211 (Hartsough, 01)
    let TreesPerAccumID, TimePerAccumID, TreesPerPMHID, VolPerPMHID, CostPerPMHID, CostPerCCFID, RelevanceID;
    // IIA: Drott (Johnson, 79) not used at present
    let TimePerTreeIIA, VolPerPMHIIA, CostPerPMHIIA, CostPerCCFIIA, RelevanceIIA;
    // IIB: Timbco 2520&Cat 227 (Johnson, 88)
    let TreeInReachIIB,TimePerCycleIIB,TimePerTreeIIB,VolPerPMHIIB,CostPerPMHIIB,CostPerCCFIIB,RelevanceIIB;
    // IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
    let UnmerchPerMerchIIC, TreesInReachIIC,ObsTreesPerCycleIIC, TreesPerCycleIIC,TreesPerPMHIIC,VolPerPMHIIC,
        CostPerPMHIIC,CostPerCCFIIC,RelevanceIIC;
    // IID: Timbco (Gonsier&Mandzak, 87)
    let TimePerTreeIID,VolPerPMHIID,CostPerPMHIID,CostPerCCFIID,RelevanceIID;
    // IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.  FERIC Technical Note TN-245)
    let VolPerPMHIIE,CostPerPMHIIE,CostPerCCFIIE,RelevanceIIE;
    // IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada. FERIC Technical Note TN-273)
    let VolPerPMHIIF,CostPerPMHIIF,CostPerCCFIIF,RelevanceIIF;
    // IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
    //      Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.  Forest Products Journal 47(11/12):59-68)
    let TreesInReachIIG,TreesPerAccumIIG,MoveFracIIG,MoveIIG,FellIIG,TimePerAccumIIG,TimePerTreeIIG,VolPerPMHIIG,
        CostPerPMHIIG,CostPerCCFIIG,RelevanceIIG;

    /*--------------Fell&Bunch START---------------------------*/
    let PMH_DriveToTree=181.30; //Todo: (hardcoded)
    DistBetweenTrees=Math.sqrt(43560/Math.max(RemovalsST,1));
// I. Drive-To-Tree
    // IA: Melroe Bobcat (Johnson, 79)
    TimePerTreeIA =0.204+0.00822*DistBetweenTrees+0.02002*DBHST+0.00244*Slope;
    VolPerPMHIA = TreeVolST/(TimePerTreeIA/60);
    CostPerPMHIA =PMH_DriveToTree;
    CostPerCCFIA =100*CostPerPMHIA/VolPerPMHIA;
    RelevanceIA =(DBHST<10?1:(DBHST<15?3-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // IB: Chainsaw Heads START
    let CutsIB=1.1;
    TimePerTreeIB =(-0.0368+0.02914*DBHST+0.00289*DistBetweenTrees+0.2134*CutsIB)*(1+CSlopeFB_Harv);
    VolPerPMHIB =TreeVolST/(TimePerTreeIB/60);
    CostPerPMHIB=PMH_DriveToTree;
    CostPerCCFIB =100*CostPerPMHIB/VolPerPMHIB;
    RelevanceIB =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // IC: Intermittent Circular Sawheads (Greene&McNeel, 91)
    let CutsIC=1.01;
    TimePerTreeIC =(-0.4197+0.01345*DBHST+0.001245*DistBetweenTrees+0.7271*CutsIC)*(1+CSlopeFB_Harv);
    VolPerPMHIC =TreeVolST/(TimePerTreeIC/60);
    CostPerPMHIC=PMH_DriveToTree;
    CostPerCCFIC =100*CostPerPMHIC/VolPerPMHIC;
    RelevanceIC =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // ID: Hydro-Ax 211 (Hartsough, 01)
    TreesPerAccumID =Math.max(1,14.2-2.18*DBHST+0.0799*Math.pow(DBHST,2));
    TimePerAccumID =0.114+0.266+0.073*TreesPerAccumID+0.00999*TreesPerAccumID*DBHST;
    TreesPerPMHID =60*TreesPerAccumID/TimePerAccumID;
    VolPerPMHID =TreeVolST*TreesPerPMHID;
    CostPerPMHID=PMH_DriveToTree;
    CostPerCCFID =100*CostPerPMHID/VolPerPMHID;
    RelevanceID=(DBHST<10?1:(DBHST<15?3-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
// II. Swing Boom
    // IIA: Drott (Johnson, 79) not used at present
    let PMH_SwingBoom=233.26; //Todo: (hardcoded)
    TimePerTreeIIA =0.388+0.0137*DistBetweenTrees+0.0398*Slope;
    VolPerPMHIIA =TreeVolST/(TimePerTreeIIA/60);
    CostPerPMHIIA =PMH_SwingBoom;
    CostPerCCFIIA =100*CostPerPMHIIA/VolPerPMHIIA;
    RelevanceIIA=0; //hardcoded

    // IIB: Timbco 2520&Cat 227 (Johnson, 88)
    let PMH_SelfLevel=238;//Todo: (hardcoded)
    let BoomReachIIB=24; //
    TreeInReachIIB =RemovalsST*Math.PI*Math.pow(BoomReachIIB,2)/43560;
    TreesPerCycleIIB =Math.max(1,TreeInReachIIB);
    TimePerCycleIIB =(0.242+0.1295*TreesPerCycleIIB+0.0295*DBHST*TreesPerCycleIIB)*(1+CSlopeFB_Harv);
    TimePerTreeIIB =TimePerCycleIIB/TreesPerCycleIIB;
    VolPerPMHIIB =TreeVolST/(TimePerTreeIIB/60);
    CostPerPMHIIB =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIB =100*CostPerPMHIIB/VolPerPMHIIB;
    RelevanceIIB =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
    let UnmerchTreesPerHaIIC=285;
    UnmerchPerMerchIIC =Math.min(1.5,285/(2.47*RemovalsST));
    let BoomReachIIC=24;
    TreesInReachIIC =RemovalsST*Math.PI*Math.pow(BoomReachIIC,2)/43560;
    ObsTreesPerCycleIIC =(4.36+9-(0.12+0.34)*DBHST+0.00084*2.47*RemovalsST)/2;
    TreesPerCycleIIC =Math.max(1,Math.min(TreesInReachIIC,ObsTreesPerCycleIIC));
    TreesPerPMHIIC =(127.8+21.2*TreesPerCycleIIC-63.1*UnmerchPerMerchIIC+0.033*UnmerchTreesPerHaIIC)/(1+CSlopeFB_Harv);
    VolPerPMHIIC =TreeVolST*TreesPerPMHIIC;
    CostPerPMHIIC =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIC =100*CostPerPMHIIC/VolPerPMHIIC;
    RelevanceIIC =(DBHST<12?1:(DBHST<18?3-DBHST/6:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IID: Timbco (Gonsier&Mandzak, 87)
    TimePerTreeIID =(0.324+0.00138*Math.pow(DBHST,2))*(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    VolPerPMHIID =TreeVolST/(TimePerTreeIID/60);
    CostPerPMHIID =PMH_SelfLevel;
    CostPerCCFIID =100*CostPerPMHIID/VolPerPMHIID;
    RelevanceIID =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<15?0:(Slope<35?-3/4+Slope/20:1));
    // IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.  FERIC Technical Note TN-245)
    VolPerPMHIIE =(50.338/0.028317*Math.pow((TreeVolST*0.028317),0.3011))/(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    CostPerPMHIIE =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIE =100*CostPerPMHIIE/VolPerPMHIIE;
    RelevanceIIE =(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada. FERIC Technical Note TN-273)
    VolPerPMHIIF =(5/0.028317+57.7*TreeVolST)/(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    CostPerPMHIIF =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIF =100*CostPerPMHIIF/VolPerPMHIIF;
    RelevanceIIF =(TreeVolST<20?1:(TreeVolST<50?5/3-TreeVolST/30:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
    //      Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.  Forest Products Journal 47(11/12):59-68)
    let HybridIIG=0;
    let DeadIIG=0;
    let DelayFracIIG =0.0963;
    let BoomReachIIG=24;
    TreesInReachIIG =RemovalsST*Math.PI*Math.pow(BoomReachIIG,2)/43560;
    TreesPerAccumIIG =Math.max(1,1.81-0.0664*DBHST+3.64/DBHST-0.0058*20-0.27*0-0.1*0);
    MoveFracIIG =0.5/(Math.trunc(TreesInReachIIG/TreesPerAccumIIG)+1);
    MoveIIG =0.192+0.00779*(BoomReachIIG+DistBetweenTrees)+0.35*HybridIIG;
    FellIIG =0.285+0.126*TreesPerAccumIIG+0.0176*DBHST*TreesPerAccumIIG-0.0394*DeadIIG;
    TimePerAccumIIG =MoveFracIIG*MoveIIG+FellIIG;
    TimePerTreeIIG =(TimePerAccumIIG*(1+DelayFracIIG)/TreesPerAccumIIG)*(1+CSlopeFB_Harv);
    VolPerPMHIIG =TreeVolST/TimePerTreeIIG*60;
    CostPerPMHIIG =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIG =100*CostPerPMHIIG/VolPerPMHIIG;
    RelevanceIIG =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));

// III. User-Defined
    let UserDefinedVolPerPMH=0.001;
    let UserDefinedCostPerPMH=null;
    let UserDefinedCostPerCCF =100*UserDefinedCostPerPMH/UserDefinedVolPerPMH;
    let UserDefinedRelevance=0;

// Summary
    let WeightedAverage =(TreeVolST>0?CHardwoodST*100*(CostPerPMHIA*RelevanceIA+CostPerPMHIB*RelevanceIB+CostPerPMHIC*RelevanceIC
        +CostPerPMHID*RelevanceID+CostPerPMHIIA*RelevanceIIA+CostPerPMHIIB*RelevanceIIB+CostPerPMHIIC*RelevanceIIC
        +CostPerPMHIID*RelevanceIID+CostPerPMHIIE*RelevanceIIE+CostPerPMHIIF*RelevanceIIF+CostPerPMHIIG*RelevanceIIG
        +UserDefinedCostPerPMH*UserDefinedRelevance)/(VolPerPMHIA*RelevanceIA+VolPerPMHIB*RelevanceIB
        +VolPerPMHIC*RelevanceIC+VolPerPMHID*RelevanceID+VolPerPMHIIA*RelevanceIIA+VolPerPMHIIB*RelevanceIIB
        +VolPerPMHIIC*RelevanceIIC+VolPerPMHIID*RelevanceIID+VolPerPMHIIE*RelevanceIIE+VolPerPMHIIF*RelevanceIIF
        +VolPerPMHIIG*RelevanceIIG+UserDefinedVolPerPMH*UserDefinedRelevance):0);
    /*------------Fell&Bunch END---------------------------*/
    return WeightedAverage;
}

function FellLargeLogTrees(Slope,RemovalsLLT,TreeVolLLT,PartialCut,DBHLLT,LogsPerTreeLLT){
    let WalkDistLLT = Math.sqrt(43560/Math.max(RemovalsLLT,1));
// I. Felling Only
    // IA (McNeel, 94)
    let SelectionTimePerTreelltA,ClearcutTimePerTreelltA,TimePerTreelltA,VolPerPMHlltA,CostPerCCFlltA,RelevancelltA;
    // IB (Peterson, 87)
    let TimePerTreelltB,VolPerPMHlltB,CostPerCCFlltB,RelevancelltB;
    // IC (Keatley, 2000)
    let TimePerTreelltC,VolPerPMHlltC,CostPerCCFlltC,RelevancelltC;
    // ID (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let TimePerTreelltD,VolPerPMHlltD,CostPerCCFlltD,RelevancelltD;
    // IE User-Defined Felling Only
    let VolPerPMHlltE,CostPerCCFlltE,RelevancelltE;
    // Summary
    let CostManFellLLT;
// II. Felling, Limbing & Bucking
    // IIA (Kellogg&Olsen, 86)
    let EastsideAdjustment,ClearcutAdjustment,TimePerTreelltIIA,VolPerPMHlltIIA,CostPerCCFlltIIA,RelevancelltIIA;
    // IIB (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs: experience from the Willamette Young Stand Project.  
    // Research Contribtion 21.  Forest Research Laboratory, Oregon State University, Corvallis.
    let LimbslltIIB,LogslltIIB,WedgelltIIB,CorridorlltIIB,NotBetweenOpeningslltIIB,OpeningslltIIB,HeavyThinlltIIB,
        DelayFraclltIIB,TimePerTreelltIIB,VolPerPMHlltIIB,CostPerCCFlltIIB,RelevancelltIIB;
    // IIC (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let DelayFraclltIIC,TimePerTreelltIIC,VolPerPMHlltIIC,CostPerCCFlltIIC,RelevancelltIIC;
    // IID User-Defined Felling, Limbing & Bucking
    let VolPerPMHlltIID,CostPerCCFlltIID,RelevancelltIID;
    // Summary
    let CostManFLBLLT;

    let PMH_Chainsaw=95.65; // hardcoded
// I. Felling Only
    // IA (McNeel, 94)
    SelectionTimePerTreelltA=0.568+0.0193*0.305*WalkDistLLT+0.0294*2.54*DBHLLT;
    ClearcutTimePerTreelltA=0.163+0.0444*0.305*WalkDistLLT+0.0323*2.54*DBHLLT;
    TimePerTreelltA=(PartialCut==1?SelectionTimePerTreelltA:Math.min(SelectionTimePerTreelltA,ClearcutTimePerTreelltA));
    VolPerPMHlltA=TreeVolLLT/(TimePerTreelltA/60);
    CostPerCCFlltA=100*PMH_Chainsaw/VolPerPMHlltA;
    RelevancelltA=1;
    // IB (Peterson, 87)
    TimePerTreelltB=(DBHLLT<10?0.33+0.012*DBHLLT:0.1+0.0111*Math.pow(DBHLLT,1.496));
    VolPerPMHlltB=TreeVolLLT/(TimePerTreelltB/60);
    CostPerCCFlltB=100*PMH_Chainsaw/VolPerPMHlltB;
    RelevancelltB=1;
    // IC (Keatley, 2000)
    TimePerTreelltC=Math.sqrt(4.58+0.07*WalkDistLLT+0.16*DBHLLT);
    VolPerPMHlltC=TreeVolLLT/(TimePerTreelltC/60);
    CostPerCCFlltC=100*PMH_Chainsaw/VolPerPMHlltC;
    RelevancelltC=1;
    // ID (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    TimePerTreelltD=1.082+0.01505*TreeVolLLT-0.634/TreeVolLLT;
    VolPerPMHlltD=TreeVolLLT/(TimePerTreelltD/60);
    CostPerCCFlltD=100*PMH_Chainsaw/VolPerPMHlltD;
    RelevancelltD=(TreeVolLLT<5?0:(TreeVolLLT<15?-0.5+TreeVolLLT/10:(TreeVolLLT<90?1:(TreeVolLLT<180?2-TreeVolLLT/90:0))));
    // IE User-Defined Felling Only
    VolPerPMHlltE=0.001;
    CostPerCCFlltE=100*PMH_Chainsaw/VolPerPMHlltE;
    RelevancelltE=0;
    // Summary
    CostManFellLLT=(TreeVolLLT>0?
        CHardwoodLLT*100*(PMH_Chainsaw*RelevancelltA+PMH_Chainsaw*RelevancelltB+PMH_Chainsaw*RelevancelltC+PMH_Chainsaw*RelevancelltD+PMH_Chainsaw*RelevancelltE)
        /(RelevancelltA*VolPerPMHlltA+RelevancelltB*VolPerPMHlltB+RelevancelltC*VolPerPMHlltC+RelevancelltD*VolPerPMHlltD+RelevancelltE*VolPerPMHlltE):0);

// II. Felling, Limbing & Bucking
    // IIA (Kellogg&Olsen, 86)
    EastsideAdjustment=1.2;
    ClearcutAdjustment=0.9;
    TimePerTreelltIIA=EastsideAdjustment*(PartialCut==1?1:(PartialCut==0?ClearcutAdjustment:null))*(1.33+0.0187*WalkDistLLT+0.0143*Slope+0.0987*TreeVolLLT+0.14);
    VolPerPMHlltIIA=TreeVolLLT/(TimePerTreelltIIA/60);
    CostPerCCFlltIIA=100*PMH_Chainsaw/VolPerPMHlltIIA;
    RelevancelltIIA=1;
    // IIB (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs: experience from the Willamette Young Stand Project.  
    // Research Contribtion 21.  Forest Research Laboratory, Oregon State University, Corvallis.
    LimbslltIIB=31.5;
    LogslltIIB=LogsPerTreeLLT;
    WedgelltIIB=0.02;
    CorridorlltIIB=0.21;
    NotBetweenOpeningslltIIB=1;
    OpeningslltIIB=0;
    HeavyThinlltIIB=(PartialCut?0:1);
    DelayFraclltIIB=0.25;
    TimePerTreelltIIB=(-0.465+0.102*DBHLLT+0.016*LimbslltIIB+0.562*LogslltIIB+0.009*Slope+0.734*WedgelltIIB+0.137*CorridorlltIIB
        +0.449*NotBetweenOpeningslltIIB+0.437*OpeningslltIIB+0.426*HeavyThinlltIIB)*(1+DelayFraclltIIB);
    VolPerPMHlltIIB=TreeVolLLT/(TimePerTreelltIIB/60);
    CostPerCCFlltIIB=100*PMH_Chainsaw/VolPerPMHlltIIB;
    // RelevancelltIIB=(TreeVolLLT<1?0:(TreeVolLLT<2?-1+TreeVolLLT/1:(TreeVolLLT<70?1:1.2-TreeVolLLT/350)));
    RelevancelltIIB=1;
    // IIC (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    DelayFraclltIIC=0.197;
    TimePerTreelltIIC=(1.772+0.02877*TreeVolLLT-2.6486/TreeVolLLT)*(1+DelayFraclltIIC);
    VolPerPMHlltIIC=TreeVolLLT/(TimePerTreelltIIC/60);
    CostPerCCFlltIIC=100*PMH_Chainsaw/VolPerPMHlltIIC;
    RelevancelltIIC=(TreeVolLLT<5?0:(TreeVolLLT<15?-0.5+TreeVolLLT/10:1));
    // IID User-Defined Felling, Limbing & Bucking
    VolPerPMHlltIID=0.001;
    CostPerCCFlltIID=100*PMH_Chainsaw/VolPerPMHlltIID;
    RelevancelltIID=0;
    // Summary
    CostManFLBLLT=(TreeVolLLT>0?CHardwoodLLT*100*
        (PMH_Chainsaw*RelevancelltIIA+PMH_Chainsaw*RelevancelltIIB+PMH_Chainsaw*RelevancelltIIC+PMH_Chainsaw*RelevancelltIID)
        /(RelevancelltIIA*VolPerPMHlltIIA+RelevancelltIIB*VolPerPMHlltIIB+RelevancelltIIC*VolPerPMHlltIIC+RelevancelltIID*VolPerPMHlltIID):0);
    
    return Math.round(CostManFLBLLT * 100) / 100; // round to at most 2 decimal places
}

function Skidding(Slope,YardDist,Removals,TreeVol,WoodDensity,LogLength,PartialCut,
    CSlopeSkidForwLoadSize,LogsPerTree,LogVol,ManualMachineSize,BFperCF,ButtDiam){
// Skidding Calculated Values
    let TurnVol,LogsPerTurnS,TreesPerTurnS,PMH_SkidderB,PMH_SkidderS,SkidderHourlyCost;
// I Choker, Unbunched
    let MaxLogs,ChokerLogs,ChokerTurnVol;
    // IA CC (Johnson&Lee, 88)
    let WinchDistSkidIA,TurnTimeSkidIA,VolPerPMHskidIA,CostPerCCFSkidIA,RelevanceSkidIA;
    // IB CC (Gibson&Egging, 73)
    let TurnTimeSkidIB,VolPerPMHskidIB,CostPerCCFskidIB,RelevanceSkidIB;
    // IC CC (Schillings, 69) not used at present
    let TurnTimeSkidIC,VolPerPMHskidIC,CostPerCCFskidIC,RelevanceSkidIC;
    // ID CC (Gardner, 79)
    let TurnTimeSkidID,VolPerPMHskidID,CostPerCCFskidID,RelevanceSkidID;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.  
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let TurnTimeSkidIE,VolPerPMHskidIE,CostPerCCFskidIE,RelevanceSkidIE;
// II Grapple, Unbunched
    let IntMoveDistS;
    // IIA Cat 518 (Johnson, 88)
    let TurnTimeSkidIIA,VolPerPMHskidIIA,CostPerCCFskidIIA,RelevanceSkidIIA;
    // IIB JD 648 (Gebhardt, 77)
    let GroundRatingSkidIIB,TypeOfCutSkidIIB,TurnTimeSkidIIB,VolPerPMHskidIIB,CostPerCCFskidIIB,RelevanceSkidIIB;
// III User-Defined Skidding Unbunched
    let VolPerPMHskidIII,CostPerCCFskidIII,RelevanceSkidIII;
// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    let DeckHeightSkidIVA,TravEmptySkidIVA,LoadSkidIVA,TravLoadedSkidIVA,DeckSkidIVA,
        TurnTImeSkidIVA,VolPerPMHskidIVA,CostPerCCFskidIVA,RelevanceSkidIVA;
    // IVB Grapple Skidders (Tufts et al, 88)
    let EastsideAdjustmentSkidIVB,BunchSizeSkidIVB,BunchVolSkidIVB,TurnWtSkidIVB,BunchesPerTurnSkidIVB,SkidderHpSkidIVB,
        TravEmptySkidIVB,GrappleSkidIVB,TravLoadedSkidIVB,UngrappleSkidIVB,CycletimeSkidIVB,VolPerPMHskidIVB,CostPerCCFskidIVB,RelevanceSkidIVB;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    let LoadingStopsSkidIVC,TurnTimeSkidIVC,VolPerPMHskidIVC,CostPerCCFskidIVC,RelevanceSkidIVC;
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    let TurnTimeSkidIVD,VolPerPMHskidIVD,CostPerCCFskidIVD,RelevanceSkidIVD;
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    let BunchesPerTurnSkidIVE,TurnTimeSkidIVE,VolPerPMHskidIVE,CostPerCCFskidIVE,RelevanceSkidIVE;
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    let TurnTimeSkidIVF,VolPerPMHskidIVF,CostPerCCFskidIVF,RelevanceSkidIVF;
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    let TreesPerTurnSkidIVG,TurnTimeSkidIVG,VolPerPMHskidIVG,CostPerCCFskidIVG,RelevanceSkidIVG;
    // IVH User-Defined Skidding Bunched
    let VolPerPMHskidIVH,CostPerCCFskidIVH,RelevanceSkidIVH;
// Skidding Summary
    let CostSkidUB,CostSkidBun;

// Skidding Calculated Values
    TurnVol=(PartialCut==0?44.87:(PartialCut==1?31.62:null))*Math.pow(TreeVol,0.282)*CSlopeSkidForwLoadSize;
    LogsPerTurnS=TurnVol/LogVol;
    TreesPerTurnS=TurnVol/TreeVol;
    PMH_SkidderB=189.61; // hardcoded
    PMH_SkidderS=133.92; //hardcoded
    SkidderHourlyCost=PMH_SkidderS*(1-ManualMachineSize)+PMH_SkidderB*ManualMachineSize;

// I Choker, Unbunched
    MaxLogs=10;
    ChokerLogs=Math.min(MaxLogs,LogsPerTurnS);
    ChokerTurnVol=ChokerLogs*LogVol;
    // IA CC (Johnson&Lee, 88)
    WinchDistSkidIA=25;
    TurnTimeSkidIA=-15.58+0.345*ChokerLogs+0.037*ChokerTurnVol+4.05*Math.log(YardDist+WinchDistSkidIA);
    VolPerPMHskidIA=ChokerTurnVol/(TurnTimeSkidIA/60);
    CostPerCCFSkidIA=100*SkidderHourlyCost/VolPerPMHskidIA;
    RelevanceSkidIA=(ChokerTurnVol<90?1:(ChokerTurnVol<180?2-ChokerTurnVol/90:0));
    // IB CC (Gibson&Egging, 73)
    TurnTimeSkidIB=2.74+0.726*ChokerLogs+0.00363*ChokerTurnVol*BFperCF+0.0002*ChokerTurnVol*WoodDensity+0.00777*YardDist+0.00313*Math.pow(Slope,2);
    VolPerPMHskidIB=ChokerTurnVol/(TurnTimeSkidIB/60);
    CostPerCCFskidIB=100*SkidderHourlyCost/VolPerPMHskidIB;
    RelevanceSkidIB=1;
    // IC CC (Schillings, 69) not used at present
    TurnTimeSkidIC=60*((0.122+0.089)+(0.000229+0.000704)*YardDist+(-0.00076+0.00127)*Slope+(0.0191+0.0118)*ChokerLogs)/2;
    VolPerPMHskidIC=ChokerTurnVol/(TurnTimeSkidIC/60);
    CostPerCCFskidIC=100*SkidderHourlyCost/VolPerPMHskidIC;
    RelevanceSkidIC=0;
    // ID CC (Gardner, 79)
    TurnTimeSkidID=2.57+0.823*ChokerLogs+0.0054*ChokerTurnVol*BFperCF+0.0078*2*YardDist;
    VolPerPMHskidID=ChokerTurnVol/(TurnTimeSkidID/60);
    CostPerCCFskidID=100*SkidderHourlyCost/VolPerPMHskidID;
    RelevanceSkidID=1;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.  
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    TurnTimeSkidIE=(7.36+0.0053*YardDist);
    VolPerPMHskidIE=ChokerTurnVol/(TurnTimeSkidIE/60);
    CostPerCCFskidIE=100*SkidderHourlyCost/VolPerPMHskidIE;
    RelevanceSkidIE=(TreeVol<5?0:(TreeVol<15?-0.5+TreeVol/10:(TreeVol<75?1:(TreeVol<150?2-TreeVol/75:0))));

// II Grapple, Unbunched
    IntMoveDistS=17.0;
    // IIA Cat 518 (Johnson, 88)
    TurnTimeSkidIIA=0.518+0.0107*YardDist+0.0011*Math.pow(Slope,3)+1.62*Math.log(LogsPerTurnS);
    VolPerPMHskidIIA=TurnVol/(TurnTimeSkidIIA/60);
    CostPerCCFskidIIA=100*SkidderHourlyCost/VolPerPMHskidIIA;
    RelevanceSkidIIA=(ButtDiam<20?1:(ButtDiam<25?5-ButtDiam/5:0));
    // IIB JD 648 (Gebhardt, 77)
    GroundRatingSkidIIB=1.1;
    TypeOfCutSkidIIB=1.5*PartialCut;
    TurnTimeSkidIIB=1.072+0.00314*YardDist+0.0192*Slope+0.315*TypeOfCutSkidIIB+0.489*LogsPerTurnS-0.819*GroundRatingSkidIIB+0.00469*IntMoveDistS+0.00139*TurnVol*BFperCF;
    VolPerPMHskidIIB=TurnVol/(TurnTimeSkidIIB/60);
    CostPerCCFskidIIB=100*SkidderHourlyCost/VolPerPMHskidIIB;
    RelevanceSkidIIB=1;
    
// III User-Defined Skidding Unbunched
    VolPerPMHskidIII=0.001;
    CostPerCCFskidIII=100*SkidderHourlyCost/VolPerPMHskidIII;
    RelevanceSkidIII=0;

// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    DeckHeightSkidIVA=3;
    TravEmptySkidIVA=-2.179+0.0362*Slope+0.711*Math.log(YardDist);
    LoadSkidIVA=Math.max(0,0.882+0.0042*Math.pow(Slope,2)-0.000048*Math.pow(TreesPerTurnS,3));
    TravLoadedSkidIVA=-0.919+0.00081*YardDist+0.000062*Math.pow(Slope,3)+0.353*Math.log(YardDist);
    DeckSkidIVA=0.063+0.55*Math.log(DeckHeightSkidIVA)+0.0076*(DeckHeightSkidIVA)*(TreesPerTurnS);
    TurnTImeSkidIVA=TravEmptySkidIVA+LoadSkidIVA+TravLoadedSkidIVA+DeckSkidIVA;
    VolPerPMHskidIVA=TurnVol/(TurnTImeSkidIVA/60);
    CostPerCCFskidIVA=100*SkidderHourlyCost/VolPerPMHskidIVA;
    RelevanceSkidIVA=(ButtDiam<15?1:(ButtDiam<20?4-ButtDiam/5:0));
    // IVB Grapple Skidders (Tufts et al, 88)
    EastsideAdjustmentSkidIVB=1.3;
    BunchSizeSkidIVB=TreesPerCycleIIB;
    BunchVolSkidIVB=TreeVol*BunchSizeSkidIVB;
    TurnWtSkidIVB=TurnVol*WoodDensity;
    BunchesPerTurnSkidIVB=Math.max(1,TurnVol/BunchVolSkidIVB);
    SkidderHpSkidIVB=50.5+5.74*Math.sqrt(TreeVol);
    TravEmptySkidIVB=(0.1905*YardDist+0.3557*SkidderHpSkidIVB-0.0003336*YardDist*SkidderHpSkidIVB)/100;
    GrappleSkidIVB=Math.min(5,(-38.36+161.6*BunchesPerTurnSkidIVB-0.5599*BunchesPerTurnSkidIVB*SkidderHpSkidIVB+1.398*BunchesPerTurnSkidIVB*BunchSizeSkidIVB)/100);
    TravLoadedSkidIVB=(-34.52+0.2634*YardDist+0.7634*SkidderHpSkidIVB-0.00122*YardDist*SkidderHpSkidIVB+0.03782*YardDist*BunchesPerTurnSkidIVB)/100;
    UngrappleSkidIVB=Math.max(0,(5.177*BunchesPerTurnSkidIVB+0.002508*TurnWtSkidIVB-0.00007944*TurnWtSkidIVB*BunchesPerTurnSkidIVB*BunchSizeSkidIVB*BunchesPerTurnSkidIVB)/100);
    CycletimeSkidIVB=EastsideAdjustmentSkidIVB*(TravEmptySkidIVB+GrappleSkidIVB+TravLoadedSkidIVB+UngrappleSkidIVB);
    VolPerPMHskidIVB=TurnVol/(CycletimeSkidIVB/60);
    CostPerCCFskidIVB=100*SkidderHourlyCost/VolPerPMHskidIVB;
    RelevanceSkidIVB=0.50;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    LoadingStopsSkidIVC=2.1;
    TurnTimeSkidIVC=0.65+0.0054*YardDist+0.244*LoadingStopsSkidIVC;
    VolPerPMHskidIVC=TurnVol/(TurnTimeSkidIVC/60);
    CostPerCCFskidIVC=100*SkidderHourlyCost/VolPerPMHskidIVC;
    RelevanceSkidIVC=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<50?1:(TreeVol<100?2-TreeVol/50:0))));
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    TurnTimeSkidIVD=2.818+0.0109*YardDist;
    VolPerPMHskidIVD=TurnVol/(TurnTimeSkidIVD/60);
    CostPerCCFskidIVD=100*SkidderHourlyCost/VolPerPMHskidIVD;
    RelevanceSkidIVD=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<50?1:(TreeVol<100?2-TreeVol/50:0))));
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    BunchesPerTurnSkidIVE=BunchesPerTurnSkidIVB;
    TurnTimeSkidIVE=0.649+0.0058*YardDist+0.581*BunchesPerTurnSkidIVE;
    VolPerPMHskidIVE=TurnVol/(TurnTimeSkidIVE/60);
    CostPerCCFskidIVE=100*SkidderHourlyCost/VolPerPMHskidIVE;
    RelevanceSkidIVE=(TreeVol<30?1:(TreeVol<60?2-TreeVol/30:0));
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    TurnTimeSkidIVF=5.77+0.007*YardDist;
    VolPerPMHskidIVF=TurnVol/(TurnTimeSkidIVF/60);
    CostPerCCFskidIVF=100*SkidderHourlyCost/VolPerPMHskidIVF;
    RelevanceSkidIVF=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<100?1:(TreeVol<150?3-TreeVol/50:0))));
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    TreesPerTurnSkidIVG=TreesPerTurnS;
    TurnTimeSkidIVG=2.98+0.006*YardDist+0.27*TreesPerTurnSkidIVG;
    VolPerPMHskidIVG=TurnVol/(TurnTimeSkidIVG/60);
    CostPerCCFskidIVG=100*SkidderHourlyCost/VolPerPMHskidIVG;
    RelevanceSkidIVG=(TreeVol<40?1:(TreeVol<80?2-TreeVol/40:0));
    // IVH User-Defined Skidding Bunched
    VolPerPMHskidIVH=0.001;
    CostPerCCFskidIVH=100*SkidderHourlyCost/VolPerPMHskidIVH;
    RelevanceSkidIVH=0;
// Skidding Summary
    CostSkidUB=CHardwood*100*(SkidderHourlyCost*RelevanceSkidIA+SkidderHourlyCost*RelevanceSkidIB+SkidderHourlyCost*RelevanceSkidIC+SkidderHourlyCost*RelevanceSkidID
        +SkidderHourlyCost*RelevanceSkidIE+SkidderHourlyCost*RelevanceSkidIIA+SkidderHourlyCost*RelevanceSkidIIB+SkidderHourlyCost*RelevanceSkidIII)
        /(RelevanceSkidIA*VolPerPMHskidIA+RelevanceSkidIB*VolPerPMHskidIB+RelevanceSkidIC*VolPerPMHskidIC+RelevanceSkidID*VolPerPMHskidID
            +RelevanceSkidIE*VolPerPMHskidIE+RelevanceSkidIIA*VolPerPMHskidIIA+RelevanceSkidIIB*VolPerPMHskidIIB+RelevanceSkidIII*VolPerPMHskidIII);
    CostSkidBun=CHardwood*100*(SkidderHourlyCost*RelevanceSkidIVA+SkidderHourlyCost*RelevanceSkidIVB+SkidderHourlyCost*RelevanceSkidIVC+SkidderHourlyCost*RelevanceSkidIVD
        +SkidderHourlyCost*RelevanceSkidIVE+SkidderHourlyCost*RelevanceSkidIVF+SkidderHourlyCost*RelevanceSkidIVG+SkidderHourlyCost*RelevanceSkidIVH)
        /(RelevanceSkidIVA*VolPerPMHskidIVA+RelevanceSkidIVB*VolPerPMHskidIVB+RelevanceSkidIVC*VolPerPMHskidIVC+RelevanceSkidIVD*VolPerPMHskidIVD
            +RelevanceSkidIVE*VolPerPMHskidIVE+RelevanceSkidIVF*VolPerPMHskidIVF+RelevanceSkidIVG*VolPerPMHskidIVG+RelevanceSkidIVH*VolPerPMHskidIVH);

    return Math.round(CostSkidBun * 100) / 100;
}