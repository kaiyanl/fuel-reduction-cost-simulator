import { CostMachineMod } from './frcs.model';

function FellBunch(Slope: number, RemovalsST: number, TreeVolST: number, DBHST: number, NonSelfLevelCabDummy: number,
                   CSlopeFB_Harv: number, CRemovalsFB_Harv: number, CHardwoodST: number, CostMachine: CostMachineMod) {
/*--------------Fell&Bunch START---------------------------*/
const PMH_DriveToTree = CostMachine.PMH_DriveToTree;
const DistBetweenTrees = Math.sqrt(43560 / Math.max(RemovalsST, 1));
// I. Drive-To-Tree
// IA: Melroe Bobcat (Johnson, 79)
const TimePerTreeIA = 0.204 + 0.00822 * DistBetweenTrees + 0.02002 * DBHST + 0.00244 * Slope;
const VolPerPMHIA = TreeVolST / (TimePerTreeIA / 60);
const CostPerPMHIA = PMH_DriveToTree;
const CostPerCCFIA = 100 * CostPerPMHIA / VolPerPMHIA;
const RelevanceIA = (DBHST < 10 ? 1 : (DBHST < 15 ? 3 - DBHST / 5 : 0))
* (Slope < 10 ? 1 : (Slope < 20 ? 2 - Slope / 10 : 0));
// IB: Chainsaw Heads START
const CutsIB = 1.1;
const TimePerTreeIB = (-0.0368 + 0.02914 * DBHST + 0.00289 * DistBetweenTrees + 0.2134 * CutsIB)
* (1 + CSlopeFB_Harv);
const VolPerPMHIB = TreeVolST / (TimePerTreeIB / 60);
const CostPerPMHIB = PMH_DriveToTree;
const CostPerCCFIB = 100 * CostPerPMHIB / VolPerPMHIB;
const RelevanceIB = (DBHST < 15 ? 1 : (DBHST < 20 ? 4 - DBHST / 5 : 0))
* (Slope < 10 ? 1 : (Slope < 20 ? 2 - Slope / 10 : 0));
// IC: Intermittent Circular Sawheads (Greene&McNeel, 91)
const CutsIC = 1.01;
const TimePerTreeIC = (-0.4197 + 0.01345 * DBHST + 0.001245 * DistBetweenTrees + 0.7271 * CutsIC)
* (1 + CSlopeFB_Harv);
const VolPerPMHIC = TreeVolST / (TimePerTreeIC / 60);
const CostPerPMHIC = PMH_DriveToTree;
const CostPerCCFIC = 100 * CostPerPMHIC / VolPerPMHIC;
const RelevanceIC = (DBHST < 15 ? 1 : (DBHST < 20 ? 4 - DBHST / 5 : 0))
* (Slope < 10 ? 1 : (Slope < 20 ? 2 - Slope / 10 : 0));
// ID: Hydro-Ax 211 (Hartsough, 01)
const TreesPerAccumID = Math.max(1, 14.2 - 2.18 * DBHST + 0.0799 * Math.pow(DBHST, 2));
const TimePerAccumID = 0.114 + 0.266 + 0.073 * TreesPerAccumID + 0.00999 * TreesPerAccumID * DBHST;
const TreesPerPMHID = 60 * TreesPerAccumID / TimePerAccumID;
const VolPerPMHID = TreeVolST * TreesPerPMHID;
const CostPerPMHID = PMH_DriveToTree;
const CostPerCCFID = 100 * CostPerPMHID / VolPerPMHID;
const RelevanceID = (DBHST < 10 ? 1 : (DBHST < 15 ? 3 - DBHST / 5 : 0))
* (Slope < 10 ? 1 : (Slope < 20 ? 2 - Slope / 10 : 0));
// II. Swing Boom
// IIA: Drott (Johnson, 79) not used at present
const PMH_SwingBoom = CostMachine.PMH_SwingBoom;
const TimePerTreeIIA = 0.388 + 0.0137 * DistBetweenTrees + 0.0398 * Slope;
const VolPerPMHIIA = TreeVolST / (TimePerTreeIIA / 60);
const CostPerPMHIIA = PMH_SwingBoom;
const CostPerCCFIIA = 100 * CostPerPMHIIA / VolPerPMHIIA;
const RelevanceIIA = 0;

// IIB: Timbco 2520&Cat 227 (Johnson, 88)
const PMH_SelfLevel = CostMachine.PMH_SelfLevel;
const BoomReachIIB = 24; //
const TreeInReachIIB = RemovalsST * Math.PI * Math.pow(BoomReachIIB, 2) / 43560;
const TreesPerCycleIIB = Math.max(1, TreeInReachIIB);
const TimePerCycleIIB = (0.242 + 0.1295 * TreesPerCycleIIB + 0.0295 * DBHST * TreesPerCycleIIB)
* (1 + CSlopeFB_Harv);
const TimePerTreeIIB = TimePerCycleIIB / TreesPerCycleIIB;
const VolPerPMHIIB = TreeVolST / (TimePerTreeIIB / 60);
const CostPerPMHIIB = PMH_SwingBoom * NonSelfLevelCabDummy + PMH_SelfLevel * (1 - NonSelfLevelCabDummy);
const CostPerCCFIIB = 100 * CostPerPMHIIB / VolPerPMHIIB;
const RelevanceIIB = (DBHST < 15 ? 1 : (DBHST < 20 ? 4 - DBHST / 5 : 0))
* (Slope < 5 ? 0 : (Slope < 20 ? -1 / 3 + Slope / 15 : 1));
// IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
const UnmerchTreesPerHaIIC = 285;
const UnmerchPerMerchIIC = Math.min(1.5, 285 / (2.47 * RemovalsST));
const BoomReachIIC = 24;
const TreesInReachIIC = RemovalsST * Math.PI * Math.pow(BoomReachIIC, 2) / 43560;
const ObsTreesPerCycleIIC = (4.36 + 9 - (0.12 + 0.34) * DBHST + 0.00084 * 2.47 * RemovalsST) / 2;
const TreesPerCycleIIC = Math.max(1, Math.min(TreesInReachIIC, ObsTreesPerCycleIIC));
const TreesPerPMHIIC = (127.8 + 21.2 * TreesPerCycleIIC - 63.1 * UnmerchPerMerchIIC + 0.033 * UnmerchTreesPerHaIIC)
/ (1 + CSlopeFB_Harv);
const VolPerPMHIIC = TreeVolST * TreesPerPMHIIC;
const CostPerPMHIIC = PMH_SwingBoom * NonSelfLevelCabDummy + PMH_SelfLevel * (1 - NonSelfLevelCabDummy);
const CostPerCCFIIC = 100 * CostPerPMHIIC / VolPerPMHIIC;
const RelevanceIIC = (DBHST < 12 ? 1 : (DBHST < 18 ? 3 - DBHST / 6 : 0))
* (Slope < 5 ? 0 : (Slope < 20 ? -1 / 3 + Slope / 15 : 1));
// IID: Timbco (Gonsier&Mandzak, 87)
const TimePerTreeIID = (0.324 + 0.00138 * Math.pow(DBHST, 2)) * (1 + CSlopeFB_Harv + CRemovalsFB_Harv);
const VolPerPMHIID = TreeVolST / (TimePerTreeIID / 60);
const CostPerPMHIID = PMH_SelfLevel;
const CostPerCCFIID = 100 * CostPerPMHIID / VolPerPMHIID;
const RelevanceIID = (DBHST < 15 ? 1 : (DBHST < 20 ? 4 - DBHST / 5 : 0))
* (Slope < 15 ? 0 : (Slope < 35 ? -3 / 4 + Slope / 20 : 1));
// IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.
// FERIC Technical Note TN-245)
const VolPerPMHIIE = (50.338 / 0.028317 * Math.pow((TreeVolST * 0.028317), 0.3011))
/ (1 + CSlopeFB_Harv + CRemovalsFB_Harv);
const CostPerPMHIIE = PMH_SwingBoom * NonSelfLevelCabDummy + PMH_SelfLevel * (1 - NonSelfLevelCabDummy);
const CostPerCCFIIE = 100 * CostPerPMHIIE / VolPerPMHIIE;
const RelevanceIIE = (Slope < 5 ? 0 : (Slope < 20 ? -1 / 3 + Slope / 15 : 1));
// IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada.
// FERIC Technical Note TN-273)
const VolPerPMHIIF = (5 / 0.028317 + 57.7 * TreeVolST) / (1 + CSlopeFB_Harv + CRemovalsFB_Harv);
const CostPerPMHIIF = PMH_SwingBoom * NonSelfLevelCabDummy + PMH_SelfLevel * (1 - NonSelfLevelCabDummy);
const CostPerCCFIIF = 100 * CostPerPMHIIF / VolPerPMHIIF;
const RelevanceIIF = (TreeVolST < 20 ? 1 : (TreeVolST < 50 ? 5 / 3 - TreeVolST / 30 : 0))
* (Slope < 5 ? 0 : (Slope < 20 ? -1 / 3 + Slope / 15 : 1));
// IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
// Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.  
// Forest Products Journal 47(11/12):59-68)
const HybridIIG = 0;
const DeadIIG = 0;
const DelayFracIIG = 0.0963;
const BoomReachIIG = 24;
const TreesInReachIIG = RemovalsST * Math.PI * Math.pow(BoomReachIIG, 2) / 43560;
const TreesPerAccumIIG = Math.max(1, 1.81 - 0.0664 * DBHST + 3.64 / DBHST - 0.0058 * 20 - 0.27 * 0 - 0.1 * 0);
const MoveFracIIG = 0.5 / (Math.trunc(TreesInReachIIG / TreesPerAccumIIG) + 1);
const MoveIIG = 0.192 + 0.00779 * (BoomReachIIG + DistBetweenTrees) + 0.35 * HybridIIG;
const FellIIG = 0.285 + 0.126 * TreesPerAccumIIG + 0.0176 * DBHST * TreesPerAccumIIG - 0.0394 * DeadIIG;
const TimePerAccumIIG = MoveFracIIG * MoveIIG + FellIIG;
const TimePerTreeIIG = (TimePerAccumIIG * (1 + DelayFracIIG) / TreesPerAccumIIG) * (1 + CSlopeFB_Harv);
const VolPerPMHIIG = TreeVolST / TimePerTreeIIG * 60;
const CostPerPMHIIG = PMH_SwingBoom * NonSelfLevelCabDummy + PMH_SelfLevel * (1 - NonSelfLevelCabDummy);
const CostPerCCFIIG = 100 * CostPerPMHIIG / VolPerPMHIIG;
const RelevanceIIG = (DBHST < 15 ? 1 : (DBHST < 20 ? 4 - DBHST / 5 : 0))
* (Slope < 5 ? 0 : (Slope < 20 ? -1 / 3 + Slope / 15 : 1));

// III. User-Defined
const UserDefinedVolPerPMH = 0.001;
const UserDefinedCostPerPMH = 0;
const UserDefinedCostPerCCF = 100 * UserDefinedCostPerPMH / UserDefinedVolPerPMH;
const UserDefinedRelevance = 0;

// Summary
const CostFellBunch = (TreeVolST > 0 ? CHardwoodST * 100
* (CostPerPMHIA * RelevanceIA + CostPerPMHIB * RelevanceIB + CostPerPMHIC * RelevanceIC
+ CostPerPMHID * RelevanceID + CostPerPMHIIA * RelevanceIIA + CostPerPMHIIB * RelevanceIIB
+ CostPerPMHIIC * RelevanceIIC + CostPerPMHIID * RelevanceIID + CostPerPMHIIE * RelevanceIIE
+ CostPerPMHIIF * RelevanceIIF + CostPerPMHIIG * RelevanceIIG + UserDefinedCostPerPMH * UserDefinedRelevance)
/ (VolPerPMHIA * RelevanceIA + VolPerPMHIB * RelevanceIB + VolPerPMHIC * RelevanceIC
+ VolPerPMHID * RelevanceID + VolPerPMHIIA * RelevanceIIA + VolPerPMHIIB * RelevanceIIB
+ VolPerPMHIIC * RelevanceIIC + VolPerPMHIID * RelevanceIID + VolPerPMHIIE * RelevanceIIE
+ VolPerPMHIIF * RelevanceIIF + VolPerPMHIIG * RelevanceIIG + UserDefinedVolPerPMH * UserDefinedRelevance) : 0);
/*------------Fell&Bunch END---------------------------*/
return { 'CostFellBunch': CostFellBunch, 'TreesPerCycleIIB': TreesPerCycleIIB };
}

export { FellBunch };
