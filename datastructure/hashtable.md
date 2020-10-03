**contents**
  - [해시테이블 구성](#해시테이블-구성)
  - [장점](#장점)
  - [단점](#단점)
  - [hash table의 크기에 대한 고찰](#hash-table의-크기에-대한-고찰)
- [해시 충돌](#해시-충돌)
- [해결 방법](#해결-방법)
- [1. Chaining](#1.-chaining)
- [2. Open Addressing(개방주소법)](#2.-open-addressing개방주소법)
  - [규칙](#규칙)
  - [선형 탐색(Liner Probing)](#선형-탐색liner-probing)
  - [제곱 탐색(Quadratic probing)](#제곱-탐색quadratic-probing)
  - [이중 해싱](#이중-해싱)
- [3. 해시함수 매핑 개선](#3.-해시함수-매핑-개선)
  - [division method](#division-method)
  - [multiplication method](#multiplication-method)
  - [univeral hashing](#univeral-hashing)
- [HashMap과 HashTable](#hashmap과-hashtable)
- [HashMap 살펴보기](#hashmap-살펴보기)
  - [해시 충돌 기법](#해시-충돌-기법)
  - [연결리스트와 트리](#연결리스트와-트리)
  - [해시 버킷 동적 확장](#해시-버킷-동적-확장)
  - [보조 해시 함수](#보조-해시-함수)

# 해시테이블

![](https://images.velog.io/images/adam2/post/c5d81486-97d2-4d02-bc51-48336966e72e/image.png)
해시테이블은 해시함수를 사용하여 키를 해시값으로 매핑하고, 이 해시값을 색인 또는 주소 삼아 데이터(value)를 key와 함께 저장하는 자료구조이다.

> 연관배열 구조: key와 value가 1:1로 연관되어있는 자료구조. key를 이용해 value를 알아낼 수 있다.

### 해시테이블 구성

- **key**
  - 고유한 값, hash function의 input이 된다.
  - 키값 그대로 저장소에 저장할 경우 다양한 키의 길이 만큼의 크기를 구성해두어야 하기 때문에 일정한 길이의 해시로 변경한다.
- **hash function**
  - key를 **고정된 길이**의 `hash`로 변경해주는 역할을 한다. 이 과정을 `hashing`이라고 한다.
  - 서로 다른 key가 같은 hash값을 갖게 되는 경우 이를 `해시 충돌` 이라고 한다. 해시 충돌 발생 확률이 적을 수록 좋다.
  - 해시충돌이 해시값 전체에 걸쳐 균등하게 발생하도록 하는 것도 중요하다. 모든 키가 02라는 동일한 해시값으로 매핑이 될 경우 데이터를 액세스할 때 비효율성이 커지고, 보안이 취약(서로 다른 키인데도 동일한 해시값)해져 굳이 해시를 도입해 데이터를 관리할 이유가 없어진다.
- **value**
  - 저장소(bucket, slot)에 최종적으로 저장되는 값으로, hash와 매칭되어 저장.
- **hash table**

  - 해시함수를 사용하여 키를 해시값으로 매핑하고, 이 해시값을 색인 또는 주소 삼아 데이터(value)를 key와 함께 저장하는 자료구조
  - 데이터가 저장되는 곳을 `버킷` 또는 `슬롯`이라고 한다.
  - 해시 테이블의 기본 연산은 삽입, 삭제, 탐색이다.

> key는 hash function을 통해 hash로 변경이 되며 hash는 value와 매칭되어 저장소에 저장이 된다.

### 장점

해시테이블은 key-value가 1:1로 매핑되어 있기 때문에 삽입, 삭제, 검색의 과정에서 모두 평균적으로 `O(1)`의 시간복잡도를 가지고 있다.

### 단점

- 해시 충돌이 발생
- 순서/관계가 있는 배열에는 어울리지 않는다 => 순서에 상관없이 key만을 가지고 삽입, 검색, 삭제하기 때문
- 공간 효율성이 떨어짐 => 데이터가 저장되기 전에 미리 저장공간을 확보해야하기 때문. 공간이 부족하거나 아예 채워지지 않은 경우가 발생
- hash function의 의존도가 높다 => 평균 시간복잡도가 `O(1)`이지만 해시함수가 매우 복잡하다면 해시테이블의 연산 속도는 증가

### hash table의 크기에 대한 고찰

![](https://images.velog.io/images/adam2/post/a36354f7-d180-43d2-97f6-39287b25ecb3/image.png)
키의 전체 개수와 동일한 크기의 버킷을 가진 해시테이블을 `Direct-address table`라고한다.
Direct-address table의 장점은 키의 개수와 테이블의 크기가 같기 때문에 해시 충돌 문제가 발생하지 않는다는 것이다.
하지만 실제 사용하는 키는 몇개 되지 않을 경우에는? 전체키 100개중에 실제로는 10개의 키만 사용하는데 100개 크기의 테이블을 유지하고 있는 것은 메모리 낭비이다.

따라서 보통의 경우 실제 사용하는 키 개수보다 적은 해시테이블을 운용한다고 한다. 그렇기에 해시 충돌이 발생할 수 밖에 없고, 해시 충돌을 해결하기 위한 다양한 방법들이 고안되었다.

## 해시 충돌

![](https://images.velog.io/images/adam2/post/be2893d0-dd35-4557-ade0-6e3490cbc924/image.png)

![](https://images.velog.io/images/adam2/post/227cf384-58c3-46c4-9993-78578add4226/image.png)
John과 Sandra의 hash가 2로 같다. 이런 현상을 hash collision이라고 한다.

해시 함수로 해시를 만드는 과정에서 서로 다른 key가 같은 해시로 변경되면 같은 공간에 2개의 value가 저장되므로 key-value가 1:1로 매핑되어야 하는 해시 테이블의 특성에 위배된다.
해시 충돌은 필연적으로 나타날 수 밖에 없다.

## 해결 방법

## 1. Chaining

![](https://images.velog.io/images/adam2/post/ca25f031-e6a7-4ef0-8a82-6cf5a25a4153/image.png)
체이닝은 저장소(bucket)에서 충돌이 일어나면 기존 값과 새로운 값을 연결리스트를 이용해 연결시키는 방법이다.

**장점**

- 한정된 저장소를 효율적으로 사용할 수 있다 => 미리 충돌을 대비해 많은 공간을 잡아놓을 필요가 없다
- 해시 함수를 선택하는 중요성이 상대적으로 적다 => 충돌이 나도 그냥 연결해주면 되니까

**단점**

- 한 hash에 자료들이 많이 연결되면 검색 효율이 낮아진다(쏠림 현상)
- 외부 저장 공간을 사용한다 => 왜?

## 2. Open Addressing(개방주소법)

개방주소법은 비어있는 hash를 찾아 데이터를 저장하는 기법이다. 따라서 개방주소법의 해시 테이블은 hash와 value가 1:1관계를 유지한다.

![](https://images.velog.io/images/adam2/post/a0880019-83ec-44b2-ae32-67ab4d536445/image.png)

위의 그림에서 John과 Sandra의 hash가 동일해 충돌이 일어난다. 이때 Sandra는 바로 그 다음 비어있던 153 hash에 값을 저장한다. 그 다음 Ted가 테이블에 저장을 하려 했으나 본인의 hash에 이미 Sandra로 채워져 있어 Ted도 Sandra처럼 바로 다음 비어있던 154 hash에 값을 저장한다.

이런 식으로 충돌이 발생할 경우 비어있는 hash를 찾아 저장하는 방법이 개방주소법이다. 이때, 비어있는 hash를 찾아가는 방법은 여러가지가 있다.

### 규칙

### 선형 탐색(Liner Probing)

해당 해시값에서 고정폭(+n)을 건너 뛰어 비어있는 해시에 저장
특정 해시값 주변 버킷이 모두 채워져 있는 primary clustring 문제에 취약
![](https://images.velog.io/images/adam2/post/f62536c5-bcf9-4d33-82f8-f6a1cd3973b6/image.png)
최초 해시값이 52이고 고정폭이 1일 경우 4번의 탐색과정을 거쳐야 한다.

### 제곱 탐색(Quadratic probing)

충돌이 일어난 해시의 제곱을 한 해시에 데이터를 저장
(1^2칸 -> 2^2칸 -> 3^2칸 -> ...)
여러 개의 서로 다른 키들이 동일한 초기 해시값(아래에서 initial probe)을 갖는 secondary clustering에 취약
![](https://images.velog.io/images/adam2/post/45c9c1da-429a-41f4-af83-95f1e54f2369/image.png)
초기 해시값이 같으면 동일한 폭으로 탐색하기 때문에 효율성이 떨어짐.

### 이중 해싱

다른 해시함수를 한번 더 적용해 나온 해시에 데이터를 저장.
이중해싱을 하면 최초 해시값이 달라지므로 탐사 이동폭이 달라지고, 탐사 이동폭이 같더라도 최초 해시값이 달라져 primary, secondary clustering을 완화할 수 있다.

**장점**

- 또 다른 저장공간 없이 해시 테이블 내에서 데이터의 저장 및 처리가 가능

**단점**

- 해시함수의 성능에 따라 해시테이블의 성능이 좌우된다
- 데이터의 길이가 늘어나면 그에 해당하는 저장소를 마련해두어야 한다

> chining은 해시테이블의 크기를 유연하게 만들고, open addressing은 해시테이블 크기는 고정시키되 저장해 둘 위치를 잘 찾는 데 관심을 둔 구조

## 3. 해시함수 매핑 개선

특정 값에 치우치지 않고 해시값을 고르게 만들어내는 해시함수가 좋은 해시함수라고 할 수 있다.

### division method

숫자로 된 키를 해시테이블의 크기 m으로 나눈 나머지를 해시값으로 변환한다.
간단하면서 빠른 연산이 가능한 것이 장점

### multiplication method

숫자 키 k, A는 0과 1 사이의 실수 일 때,
`h(k)=(kA mod 1)×m`
2진수 연산에 최적화된 컴퓨터구조를 고려한 해시함수라고 한다.
나눗셈법보다는 다소느리다.

### univeral hashing

다수의 해시함수를 만들고, 이 해시함수의 집합 H에서 무작위로 해시함수를 선택해 해시값을 만드는 기법
H에서 무작위로 뽑은 해시함수가 주어졌을 때 임의의 키값을 임의의 해시값에 매핑할 확률을 1/m로 만드려는 것이 목적.

다음과 같은 특정 조건의 해시함수 집합 H는 1/m으로 만드는 게 가능하다고 수학적으로 증명되었다고 한다.

- 해시테이블의 크기 m를 소수로 정한다.
- 키값을 다음과 같이 r+1개로 쪼갠다 : k0, k1,…, kr
- 0부터 m−1 사이의 정수 가운데 하나를 무작위로 뽑는다. 분리된 키값의 개수(r+1)만큼 반복해서 뽑는다. 이를 a=[a0,a1,…,ar]로 둔다. 따라서 a의 경우의 수는 모두 mr+1가지이다.
- 해시함수를 다음과 같이 정의한다 : ha(x)=Σri=0(aikimod m)
- a가 mr+1가지이므로 해시함수의 집합 H의 요소 수 또한 mr+1개이다.

위와 같은 조건에서는 키가 동일하더라도 a가 얼마든지 랜덤하게 달라질 수 있고, 이에 해당하는 해시함수 ha 또한 상이해지기 때문에 H는 유니버설 함수가 된다.

---

# [번외] 자바에서의 hash

## HashMap과 HashTable

`HashTable`이란 JDK 1.0부터 있던 Java의 API이고, `HashMap`은 Java 2에서 처음 선보인 Java Collections Framework에 속한 API다.
HashTable 또한 Map 인터페이스를 구현하고 있기 때문에 HashMap과 HashTable이 제공하는 기능은 같다.

**차이점**

1. 보조 해시 함수
   HashMap은 `보조 해시 함수(Additional Hash Function)`를 사용하기 때문에 보조 해시 함수를 사용하지 않는 HashTable에 비하여 해시 충돌(hash collision)이 덜 발생할 수 있어 상대으로 성능상 이점이 있다.
2. 동기화
   HashMap의 경우 `동기화`를 지원하지 않는다. 그래서 Hashtable은 동기화 처리라는 비용때문에 HashMap에 비해 더 느리다고 한다.프로그래밍상의 편의성 때문에 멀티쓰레드 환경에서도 Hashtable 을 쓰기 보다는HashMap을 다시 감싸서
   `Map m = Collections.synchronizedMap(new HashMap(...));`
   과 같은 형태가 최근에는 더 선호.

## HashMap 살펴보기

### 해시 충돌 기법

Java HashMap에서 사용하는 방식은 `Separate Channing`이다. Open Addressing은 데이터를 삭제할 때 처리가 효율적이기 어려운데, HashMap에서 remove() 메서드는 매우 빈번하게 호출될 수 있기 때문이다.
게다가 HashMap에 저장된 키-값 쌍 개수가 일정 개수 이상으로 많아지면, 일반적으로 Open Addressing은 Separate Chaining보다 느리다. Open Addressing의 경우 해시 버킷을 채운 밀도가 높아질수록 Worst Case 발생 빈도가 더 높아지기 때문이다. 반면 Separate Chaining 방식의 경우 해시 충돌이 잘 발생하지 않도록 '조정'할 수 있다면 Worst Case 또는 Worst Case에 가까운 일이 발생하는 것을 줄일 수 있다.

### 연결리스트와 트리

위에서 체이닝 방식은 보통 연결 리스트를 사용해 value들을 연결한다고 했다.
HashMap 또한 연결리스트를 사용하였지만, Java 8부터 버킷의 데이터가 일정 개수 이상일 때는 연결리스트 대신 `트리(Red-Black Tree)`를 사용한다고 한다.
이렇게 트리를 사용하는것으로 변경 후, 기존 get()메서드 호출에 대한 기댓값
![](https://images.velog.io/images/adam2/post/06d0b9f3-3eb4-4fd1-8c32-be89239f64c7/image.png)에서
![](https://images.velog.io/images/adam2/post/00effa5a-e1b5-4f19-a0b8-bc4688c47aa3/image.png)으로 성능이 향상되었다.

하나의 해시 버킷에 `8개`이상의 키-값 쌍이 모이면 링크드리스트를 트리로 변경한다. 그리고 `6개`에 이르게 되면 다시 링크드리스트로 변경한다. 트리는 링크드 리스트보다 메모리 사용량이 많고, 데이터의 개수가 적을 때 트리와 링크드 리스트의 Worst Case 수행 시간 차이 비교는 의미가 없기 때문이다.

```
static final int TREEIFY_THRESHOLD = 8;

static final int UNTREEIFY_THRESHOLD = 6;
```

### 해시 버킷 동적 확장

아까 해시 테이블의 크기를 메모리의 효율성을 위해서 기본적으로 전체 키의 크기보다 작게 만든다고 했다. 하지만 이로 인해 해시 충돌이 발생하고 성능상 손실이 발생한다.
**그래서 HashMap은 key-value 쌍 데이터 개수가 일정 개수 이상이 되면, 해시 버킷의 수를 두배로 늘린다.** 해시버킷의 수를 늘려 해시 충돌의 확률을 줄이는 것이다.

해시 버킷 개수의 기본값은 16이고, 버킷의 최대 개수는 230개다. 그런데 이렇게 버킷 개수가 두 배로 증가할 때마다, 모든 키-값 데이터를 읽어 새로운 Separate Chaining을 구성해야 하는 문제가 있다. HashMap 생성자의 인자로 초기 해시 버킷 개수를 지정할 수 있으므로, 해당 HashMap 객체에 저장될 데이터의 개수가 어느 정도인지 예측 가능한 경우에는 이를 생성자의 인자로 지정하면 불필요하게 Separate Chaining을 재구성하지 않게 할 수 있다.

resize를 하게 되면 새 해시 버킷을 생성한 다음, 기존 모든 해시 버킷을 순회하면서 각 해시 버킷에 있는 링크드 리스트를 순회하며 key-value쌍을 저장한다. 이때 해시 버킷 개수가 변경되었기 때문에 index값(hashCode % M)을 다시 계산해야 한다.

그런데 이렇게 해시 버킷 크기를 두 배로 확장하는 것에는 결정적인 문제가 있다. 해시 버킷의 개수 M이 2a 형태가 되기 때문에, index = X.hashCode() % M을 계산할 때 X.hashCode()의 하위 a개의 비트만 사용하게 된다는 것이다. 즉 해시 함수가 32비트 영역을 고르게 사용하도록 만들었다 하더라도 해시 값을 2의 승수로 나누면 해시 충돌이 쉽게 발생할 수 있다.

이 때문에 보조 해시 함수가 필요하다.

### 보조 해시 함수

보조 해시 함수의 목적은 key의 해시값을 변경해 해시 충돌 가능성을 줄이는 것이다.

```java
//java 8 보조 해시 함수
static final int hash(Object key) { int h; return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16); }
```

Java 8 HashMap 보조 해시 함수는 상위 16비트 값을 XOR 연산하는 매우 단순한 형태의 보조 해시 함수로 변경되었다.
이유로는 두 가지가 있는데, 첫 번째는 Java 8에서는 해시 충돌이 많이 발생하면 링크드 리스트 대신 트리를 사용하므로 해시 충돌 시 발생할 수 있는 성능 문제가 완화되었기 때문이다. 두 번째로는 최근의 해시 함수는 균등 분포가 잘 되게 만들어지는 경향이 많아, Java 7까지 사용했던 보조 해시 함수의 효과가 크지 않기 때문이다. 두 번째 이유가 좀 더 결정적인 원인이 되어 Java 8에서는 보조 해시 함수의 구현을 바꾸었다.

---

참고

[https://velog.io/@cyranocoding/Hash-Hashing-Hash-Table](https://velog.io/@cyranocoding/Hash-Hashing-Hash-Table%ED%95%B4%EC%8B%9C-%ED%95%B4%EC%8B%B1-%ED%95%B4%EC%8B%9C%ED%85%8C%EC%9D%B4%EB%B8%94-%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0%EC%9D%98-%EC%9D%B4%ED%95%B4-6ijyonph6o#%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0%EB%8A%94-%EB%8F%84%EB%8C%80%EC%B2%B4-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C)

[https://ratsgo.github.io](https://ratsgo.github.io/data%20structure&algorithm/2017/10/25/hash/)

[https://d2.naver.com/helloworld/831311](https://d2.naver.com/helloworld/831311)

