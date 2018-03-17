
declare type $$state = Object;
declare type $$props = Object;
declare type $$selector<X> = (state: $$state, props: $$props)=>X;
declare type $$selectorExact<X> = (state: $$state, props: $$props)=>$Exact<X>;
