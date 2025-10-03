// shared product data
const PRODUCTS = [
		{id:'p1',title:'Multipurpose Detergent Chemicals',price:850,category:'Detergent',size:'20 litres',img:'pictures/multipurpose.jpg', description:'Multipurpose detergent chemicals - 20 litres @ Ksh 850'},
	{id:'p1',title:'Multipurpose Detergent Chemicals',price:850,category:'Detergent',size:'20 litres',img:'pictures/multipurpose.jpg', description:'Multipurpose detergent chemicals - 20 litres @ Ksh 850'},
	{id:'p2',title:'Multipurpose Detergent Chemicals',price:450,category:'Detergent',size:'10 litres',img:'pictures/multipurpose 2.jpg', description:'Multipurpose detergent chemicals - 10 litres @ Ksh 450'},
	{id:'p3',title:'Fabric Softener',price:550,category:'Softener',size:'5 litres',img:'pictures/softener.jpg', description:'Fabric softener - 5 litres @ Ksh 550'},
	{id:'p4',title:'Powder Detergent',price:850,category:'Detergent',size:'10 kgs',img:'pictures/liquid soap.jpg', description:'Powder detergent - 10 kgs @ Ksh 850'},
	{id:'p5',title:'Bleach',price:600,category:'Bleach',size:'5 litres',img:'pictures/bleach.jpg', description:'Bleach - 5 litres @ Ksh 600'},
	{id:'p6',title:'Dishwashing Detergent',price:300,category:'Dishwashing',size:'5 litres',img:'pictures/dish washing.jpg', description:'Dishwashing detergent - 5 litres @ Ksh 300'},
	{id:'p7',title:'Hand Wash Chemicals',price:1000,category:'Hand Wash',size:'20 litres',img:'pictures/hand washing.jpg', description:'Hand wash chemicals - 20 litres @ Ksh 1000'},
	{id:'p8',title:'Hand Wash Chemicals',price:500,category:'Hand Wash',size:'10 litres',img:'pictures/hand washing.jpg', description:'Hand wash chemicals - 10 litres @ Ksh 500'},
	{id:'p9',title:'Engine Degreaser Chemicals',price:700,category:'Degreaser',size:'10 litres',img:'pictures/engine.jpg', description:'Engine degreaser chemicals - 10 litres @ Ksh 700'},
	{id:'p10',title:'Carwax',price:0,category:'Car Care',size:'',img:'pictures/car wax.jpg', description:'Carwax'},
	{id:'p11',title:'Tyre Polish Chemical',price:0,category:'Car Care',size:'',img:'pictures/car polish.jpg', description:'Tyre polish chemical'},
	{id:'p12',title:'Floor Cleaner Chemicals',price:500,category:'Floor Cleaner',size:'10 litres',img:'pictures/floor cleaner.jpg', description:'Floor cleaner chemicals - 10 litres @ Ksh 500'},
	{id:'p13',title:'Floor Cleaner Chemicals',price:300,category:'Floor Cleaner',size:'5 litres',img:'pictures/floor cleaner.jpg', description:'Floor cleaner chemicals - 5 litres @ Ksh 300'},
	{id:'p14',title:'Disinfectant - Surgical Spirit',price:800,category:'Disinfectant',size:'5 litres',img:'pictures/disinfectant.jpg', description:'Surgical spirit - 5 litres @ Ksh 800'},
	{id:'p15',title:'Disinfectant - Methylated Spirit',price:750,category:'Disinfectant',size:'5 litres',img:'pictures/methylated.jpg', description:'Methylated spirit - 5 litres @ Ksh 750'},
	{id:'p16',title:'Disinfectant - Antiseptic',price:900,category:'Disinfectant',size:'5 litres',img:'pictures/antiseptic.jpg', description:'Antiseptic disinfectant - 5 litres @ Ksh 900'},
	{id:'p17',title:'Hydrogen Peroxide',price:50,category:'Disinfectant',size:'250mls',img:'pictures/hydrogen.jpg', description:'Hydrogen peroxide 250mls @ Ksh 50'},
	{id:'p18',title:'Protection - Musk Carton',price:750,category:'Protection',size:'',img:'pictures/carton.jpg', description:'Musk carton @ Ksh 750'},
	{id:'p19',title:'Protection - Medical Examination Gloves',price:650,category:'Protection',size:'',img:'pictures/examination gloves.jpg', description:'Medical examination gloves @ Ksh 650'},
	{id:'p20',title:'Protection - Classic Condoms',price:650,category:'Protection',size:'',img:'pictures/classic condom.jpg', description:'Classic condoms @ Ksh 650'},
	{id:'p21',title:'Skin Care Products',price:0,category:'Skin Care',size:'',img:'pictures/skin care products.jpg', description:'Skin care products'}
	];

/* Small helper to get product by id */
function getProductById(id){ return PRODUCTS.find(p=>p.id===id); }
