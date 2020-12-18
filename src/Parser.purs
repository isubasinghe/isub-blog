module Parser where

import Prelude
import Control.Alt (class Alt, (<|>))
import Data.Either (Either(..))
import Data.String.CodeUnits (fromCharArray, singleton, toCharArray)
import Data.Tuple (Tuple(..))
import Data.List(List(..), fromFoldable, toUnfoldable)

newtype Parser a = Parser (String -> Either String (Tuple a String))

runParser :: forall a. Parser a -> String -> Either String (Tuple a String)
runParser (Parser g) s = g s

instance functorParser :: Functor Parser where
    map g (Parser f) = Parser (\s -> case f s of
        Right (Tuple o s') -> Right (Tuple (g o) s') 
        Left z -> Left z )


instance applyParser :: (Functor Parser) => Apply Parser where
    apply (Parser p) (Parser p') = Parser \input -> do
        Tuple a s <- p input
        Tuple a' s' <- p' s
        Right (Tuple (a a') s)

instance applicativeParser :: (Apply Parser) => Applicative Parser where
    -- pure :: forall a. a -> f a
    pure x = Parser (\s -> Right (Tuple x s))

instance bindParser :: (Apply Parser) => Bind Parser where
    -- bind :: forall a b. m a -> (a -> m b) -> m b
    bind m g = Parser (\s -> case runParser m s of
        Right (Tuple v s') -> runParser (g v) s'
        Left e          -> Left e)

instance monadParser :: (Bind Parser) => Monad Parser

instance alternativeParser :: Alt Parser where
    alt (Parser p) (Parser p') = Parser (\s -> p s <|> p' s)


fail :: forall a. Parser a
fail = Parser (\_ -> Left "fail")


char :: Char -> Parser Char
char c = Parser (\s -> case fromFoldable (toCharArray s) :: List Char of 
                        Nil -> Left "empty"
                        Cons x xs -> if x == c then 
                            Right (Tuple x (fromCharArray ( toUnfoldable xs))) 
                            else Left ("Expected <" <> singleton c <> "> but got <" <> singleton x <> ">" ))

