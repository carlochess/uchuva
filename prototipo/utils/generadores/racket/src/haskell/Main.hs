module Main where
import Grammar
import Tokens

type Env = String -> Exp
emptyEnv = error "Not found"
envLookup s env = env s
envBind s v env = (\s' -> if s == s' then v else env s)

eval :: Exp -> Env -> Int
eval (Int v) _         = v
eval (Plus e1 e2) env  = (eval e1 env) + (eval e2 env)
eval (Minus e1 e2) env = (eval e1 env) - (eval e2 env)
eval (Times e1 e2) env = (eval e1 env) * (eval e2 env)
eval (Div e1 e2) env   = (eval e1 env) `div` (eval e2 env)
eval (Negate e) env    = -(eval e env)
eval (Var s) env       = eval (envLookup s env) env
eval (Let s e1 e2) env = eval e2 env'
    where env' = envBind s e1 env
    
run :: Exp -> Int
run e = eval e emptyEnv

main :: IO ()
main = do
    s <- getContents
    let ast = parseCalc (scanTokens s)
    print ast
    print (run ast)
    
