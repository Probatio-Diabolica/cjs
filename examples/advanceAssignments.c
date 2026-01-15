int main()
{
    int x = 11; 
    int y = 11;

    if(x > y) x = 9090 ;
    else if (x == y) x= x + 9090;
    else  x = y;

    return x;
}