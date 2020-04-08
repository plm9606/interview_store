# 자료구조

**Contents**

- [배열](#Array배열)
- [리스트](#List)

# Array(배열)

- 여러 데이터를 하나의 이름으로 그룹핑해서 관리 하기 위한 자료구조. `index`와 값의 쌍으로 구성
- index는 값에 대한 **유일무이한 식별자**(마치 주민번호)( 리스트에서 인덱스는 몇 번째 데이터인가 정도의 의미를 가짐)
- 논리적 저장 순서와 물리적 저장 순서가 일치 => index로 해당 원소에 접근할 수 있다. (`O(1)`)
- 연속된 메모리의 공간으로 이루어져 있다
- 배열은 정의와 동시에 길이를 지정하며 길이를 바꿀 수 없다.

### 장점

- 인덱스를 통한 검색이 용이함.
- 연속적이므로 메모리 관리가 편하다.

### 단점

- 크기가 고정되어 있기 때문에 어떤 엘리먼트가 삭제되면, 삭제된 상태를 빈 공간으로 남겨두어야 한다. => `메모리 낭비`
- 정적이므로 배열의 크기를 컴파일 이전에 정해주어야 한다.
- 컴파일 이후 배열의 크기를 변동 할 수 없다.

# List

- 리스트는 순서가 있는 엘리먼트의 모임으로 배열과는 다르게 빈 엘리먼트는 절대 허용하지 않는다.
- 리스트는 배열이 가지고 있는 인덱스라는 장점을 버리고 대신 **빈틈없는 데이터의 적재** 라는 장점을 취함
- 리스트에서 인덱스는 몇 번째 데이터인가 정도(순서)의 의미를 가진다. (배열-Array에서의 인덱스는 값에 대한 유일무이한 식별자)
- 빈 엘리먼트는 허용하지 않는다. => java에서는 허용하는 경우가 있음
- 순차성을 보장하지 못하기 때문에 spacial locality 보장이 되지 않아서 cash hit가 어렵다.(데이터 갯수가 확실하게 정해져 있고, 자주 사용된다면 array가 더 효율적이다.)
- 불연속적으로 메모리 공간을 차지.
- 포인터를 통한 접근

### 장점

- 포인터를 통하여 다음 데이터의 위치를 가르켜고 있어 삽입 삭제의 용이.
- 동적이므로 크기가 정해져 있지 않다.
- 메모리의 재사용 편리
- 불연속적이므로 메모리 관리의 편리

### 단점

- 검색 성능이 좋지 않다.
- 포인터를 통해 다음 데이터를 가르키므로 추가적인 메모리 공간 발생.

|       | 추가/삭제 | 조회 |
| ----- | --------- | ---- |
| Array | 느림      | 빠름 |
| List  | 빠름      | 느림 |

- 배열 : 데이터의 크기가 정해져 있고, 추가적인 삽입 삭제가 일어 나지 않으며 검색을 필요로 할 때 유리.
- 리스트 : 데이터의 크기가 정해져 있지 않고, 삽입 삭제가 많이 일어나며, 검색이 적은 경우 유리.

---

# Java List Collection

List는 Collection 인터페이스를 확장한 자료형으로 동일한 데이터의 중복 입력이 가능하며 순차적이고 다량의 데이터를 입력할 때 주로 사용합니다. 종류는 Vector, Arraylist, Linkedlist가 있습니다.

## ArrayList

일반 배열과 ArrayList는 인덱스로 객체를 관리한다는 점에서 동일하지만, 크기를 동적으로 늘릴 수 있다는 점에서 차이점이 있다.ArrayList는 내부에서 처음 설정한 저장 용량(capacity)가 있다. 설정한 저장 용량 크기를 넘어서 더 많은 객체가 들어오게 되면, 배열 크기를 **1.5배**로 증가시킴

```
// DEFAULT_CAPACITY=10
// 기본 저장용량 10으로 리스트 생성
List<String> list = new ArrayList<>();

// 저장 용량을 100으로 설정해 ArrayList 생성
List<String> list = new ArrayList<>(100);
```

ArrayList에서 특정 인덱스의 객체를 제거하게 되면, 제거한 객체의 인덱스부터 마지막 인덱스까지 모두 앞으로 1칸씩 앞으로 이동한다. 객체를 추가하게 되면 1칸씩 뒤로 이동하게 된다. 인덱스 값을 유지하기 위해서 전체 객체가 위치가 이동한다.
따라서 잦은 원소의 이동, 삭제가 발생할 경우 ArrayList보다 LinkedList를 사용하는 것이 좋다.

### 배열과 ArrayList의 차이

- 배열은 크기가 고정되어있지만 arrayList는 사이즈가 동적인 배열이다.
- 배열은 primitive type(int, byte, char 등)과 object 모두를 담을 수 있지만, arrayList는 object element만 담을 수 있다.
- 배열은 제네릭을 사용할 수 없지만, arrayList는 타입 안정성을 보장해주는 제네릭을 사용할 수 있다.
- 길이에 대해 배열은 length 변수를 쓰고, arrayList는 size() 메서드를 써야한다.
- 배열은 element들을 할당하기 위해 assignment(할당) 연산자를 써야하고, arrayList는 add() 메서드를 통해 element를 삽입한다.

```java
// ArrayList.class

private Object[] grow(int minCapacity) {
        // newCapacity 길이의 새 배열에 기존 배열 복사
        return this.elementData = Arrays.copyOf(this.elementData, this.newCapacity(minCapacity));
    }

 private int newCapacity(int minCapacity) {
        int oldCapacity = this.elementData.length;
        // 기존 리스트 길이 + (기존리스트길이/2)
        // 길이가 부족할 경우 1.5배 길이를 늘린다
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity <= 0) {
            if (this.elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
                return Math.max(10, minCapacity);
            } else if (minCapacity < 0) {
                throw new OutOfMemoryError();
            } else {
                return minCapacity;
            }
        } else {
            return newCapacity - 2147483639 <= 0 ? newCapacity : hugeCapacity(minCapacity);
        }
    }
```

## LinkedList

노드 간에 연결(link)을 통해서 리스트로 구현된 객체이다. 다음 노드의 위치 정보만 가지고 있으며 **인덱스를 가지고 있지 않기 때문에** 탐색시 `순차접근`만 가능 (노트 탐색 시 시간이 많이 소요될 수 있음)
노드 추가/삭제는 위치정보의 수정만으로 가능하기 때문에 성능이 좋음

## Vector

Vector는 ArrayList와 동일한 내부 구조를 가지고 있다. Vector 객체를 생성하기 위해서는 저장할 타입을 지정해야 한다.
ArrayList와 차이점으로는 Vector 클래스는 `동기화된(synchronized)` 메서드로 구성되어 있다. 그렇기 때문에 멀티 스레드 환경에서 안전하게 객체를 추가, 삭제할 수 있다.(Thread Safe)
다만 동기화되어 있기 때문에 ArrayList 보다는 객체를 추가, 삭제하는 과정은 느릴수 밖에 없다.(trade off)
데이터 추가 시 공간이 부족한 경우 배열 크기를 2배로 증가시킨다.

## 노드 삽입 과정 비교

- Arraylist, Vector
  ![](https://images.velog.io/images/adam2/post/d076d376-72fa-4fba-bd5f-a7360f4ea65e/image.png)
- LinkedList :: 노드 생성 후 주소값만 변경
  ![](https://images.velog.io/images/adam2/post/78140e83-4789-4e09-9a4e-e354dbee80a7/image.png)

ArrayList : 객체 검색, 맨 마지막 인덱스에 객체 추가에 좋은 성능을 발휘함
LinkedList : 객체 삽입 및 삭제에 좋은 성능을 발휘함
Vector: 멀티스레드 환경에서 사용

---

참고
https://cupjoo.tistory.com/44 [오지는 컴퓨터 공부]
https://wayhome25.github.io/cs/2017/04/17/cs-18-1/
[https://changun516.tistory.com/9](https://changun516.tistory.com/9)
https://lelecoder.com/78
[https://17billion.github.io/java/2017/06/18/java_collection_vector_arraylist_linkedlist.html](https://17billion.github.io/java/2017/06/18/java_collection_vector_arraylist_linkedlist.html)
https://zorba91.tistory.com/287

---

# Tree

트리는 일반적으로 대상 정보의 각 항목들을 계층적으로 연관되도록 구조화시키고자 할 때 사용하는 비선형 자료구조이다.
데이터 요소들의 단순한 나열이 아닌 부모-자식 관계의 계층적 구조로 표현이 된다.
트리는 그래프의 한 종류이며 사이클이 없다.

## 용어

![](https://images.velog.io/images/adam2/post/41b22e4e-c45b-4929-a6ae-c247a56ad91f/image.png)

- **node**: 트리를 구성하고 있는 각 요소
- **Edge(간선)**: 트리를 구성하기 위해 노드와 노드를 연결하는 선
- **Root Node**: 최상위 계층에 존재하는 노드
- **level**: 트리의 특정 깊이를 가지는 노드의 집합
- **degree(차수)**: 하위 트리 개수 / 간선 수 (degree) = 각 노드가 지닌 가지의 수
- **Terminal Node ( = leaf Node, 단말 노드)** : 하위에 다른 노드가 연결되어 있지 않은 노드
- **Internal Node (내부노드, 비단말 노드)** : 단말 노드를 제외한 모든 노드로 루트 노드를 포함한다.

## 이진트리(Binary Tree)

이진트리는 트리를 구성하는 노드들의 최대 차수(degree)가 2인 노드들로 구성되는 트리이다.

- 이진트리의 레벨 i에서 가질 수 있는 최대 노드의 수는 2^i이다. (i>=0)
- 깊이가 k인 이진트리가 가질 수 있는 최대 노드의 수는 2^k-1이다.(k>=1)

이진트리는 `완전 이진 트리(Completable Binary Tree)`와 `포화 이진 트리(Perfect Binary Tree)`, `전 이진 트리(Full Binary Tree)`라고 하는 특별한 트리 구조를 정의할 수 있다.
![](https://images.velog.io/images/adam2/post/762e149f-6231-4df0-a849-cd39892e387d/image.png)
**완전 이진 트리**
![](https://images.velog.io/images/adam2/post/86e22d30-5be1-45e9-ac2b-5fa5403721d1/image.png)

- 트리를 구성하고 있는 임의의 두 단말 노드의 레벨 차이가 1이하이고,
- 마지막 레벨을 제외한 모든 레벨에 존재할 수 있는 모든 노드를 갖고 있으며,
- 왼쪽에서 오른쪽으로 채워지는 이진트리
- `heap`

**전 이진 트리**
![](https://images.velog.io/images/adam2/post/9e3dc01f-51d3-4f48-99c4-3a06b576ef6c/image.png)

- 모든 노드가 0개 또는 2개의 자식 노드를 갖는 트리.

**포화 이진 트리**

- 모든 레벨에 노드가 차있는 상태로 최대 노드 수인 2^k-1개로 채워져 있는 트리
- 전 이진 트리이면서 완전 이진 트리인 경우

### 이진 트리의 표현

1. 배열을 이용한 표현

![](https://images.velog.io/images/adam2/post/e6e1251b-fcc6-4228-8e51-6dc01f577289/image.png)

![](https://images.velog.io/images/adam2/post/04cff6ff-7e08-47f0-b81e-7930960f19a3/image.png)

- 빈 노드에 대해서는 계속 사용하지 않기 때문에 메모리 낭비
- 데이터의 삽입, 삭제 연산시 노드의 레벨 변경으로 인한 데이터의 이동 발생

2. 연결리스트를 이용한 표현

- 각 노드는 data필드와 왼쪽 서브 트리를 가리키는 필드, 오른쪽 서브 트리를 가리키는 필드로 구성

### 이진 트리 순회

![](https://images.velog.io/images/adam2/post/8c6c9235-3bf5-4413-92e5-b771e6d5e734/image.png)

1. 중위 순회(inorder traversal)
   `왼쪽 서브트리 -> 루트 -> 오른쪽 서브트리`
   루트 노드가 가운데에 온다.
   4-2-5-1-3
   .
2. 후위 순회(postorder traversal)
   `왼쪽 서브트리 -> 오른쪽 서브트리 -> 루트`
   루트 노드가 후위에 온다.
   4-5-2-3-1
   .
3. 전위 순회(preorder traversal)
   `루트 -> 왼쪽 -> 오른쪽`
   루트 노드가 맨 앞에 온다.
   1-2-4-5-3

## 이진 탐색 트리(Binary Search Tree)

모든 노드가 자신의 왼쪽 서브트리에는 현재노드보다 작은 키값이, 오른쪽 서브트리에는 현재 노드보다 큰 값이 오는 규칙을 만족하는 이진트리이다.

`모든 왼쪽 자식들 <= n < 모든 오른쪽 자식들` (모든 노드 n에 대해서 반드시 참)
규칙 1. 이진 탐색 트리의 노드에 저장된 키는 유일하다.
규칙 2. 루트 노드의 키가 왼쪽 서브 트리를 구성하는 어떠한 노드의 키보다 크다.
규칙 3. 루트 노드의 키가 오른쪽 서브 트리를 구성하는 어떠한 노드의 키보다 작다.
규칙 4. 왼쪽과 오른쪽 서브트리도 이진 탐색 트리이다.

- 이진 탐색 트리의 탐색 연산은 **평균 O(log n)**의 시간 복잡도를 갖는다.
- 비교적 삽입, 삭제가 효율적인 자료구조이다.
- 이진 탐색 트리는 **Skewed Tree(편향 트리)**가 될 수 있다.
  - 저장 순서에 따라 계속 한 쪽으로만 노드가 추가되는 경우가 발생하기 때문.(**O(n)**)
  - 이를 해결하기 위해 **균형잡힌 이진검색트리**를 고안. 대표적인 것은 **레드블랙트리**와 **AVL트리**다.
- 이진 탐색 트리는 이진 탐색을 쉽게 할 수 있도록 만들어진 트리이다.

### Red-Black Tree

레드블랙 트리는 자가균형이진탐색 트리(self-balancing binary search tree)로써, 대표적으로 연관배열(associative array) 등을 구현하는데 쓰이는 자료구조이다.

### 특징

**balanced binary search tree**

- 이진 탐색 트리가 편향 트리가 될 경우를 방지하는 조건을 추가함
  - 균형이 잡혀 위 그림 같은 경우가 안나온다 -> 레드블랙트리의 높이는 logn에 바운드 된다 -> 레드블랙트리에서 삽입, 삭제, 검색 연산은 **O(logn)**의 시간복잡도를 가지게 된다.
- 자료의 삽입과 삭제, 검색에서 최악의 경우에도 일정한 실행 시간을 보장한다(worst-case guarantees).
  - 이는 실시간 처리와 같은 실행시간이 중요한 경우에 유용하게 쓰일 뿐만 아니라, 일정한 실행 시간을 보장하는 또 다른 자료구조를 만드는 데에도 쓸모가 있다. 예를 들면, 각종 기하학 계산에 쓰이는 많은 자료 구조들이 레드-블랙 트리를 기반으로 만들어져 있다.

### 조건

1. Root Property : 루트노드의 색깔은 검정(Black)이다.
   (추가되는 노드는 빨강이다)
2. External Property : 모든 external node들은 검정(Black)이다.
3. Internal Property : 빨강(Red)노드의 자식은 검정(Black)이다.
   == No Double Red(빨간색 노드가 연속으로 나올 수 없다.)
4. Depth Property : 모든 리프노드에서 Black Depth는 같다.
   == 리프노드에서 루트노드까지 가는 경로에서 만나는 블랙노드의 개수는 같다.
   (그냥 노드의 수는 다를 수 있음.)

위 조건들을 만족하게 되면, 레드블랙 트리는 가장 중요한 특성을 나타내게 된다. 루트 노드부터 가장 먼 경로까지의 거리가, 가장 가까운 경로까지의 거리의 두 배보다 항상 작다. 다시 말해 레드블랙 트리는 개략적으로 균형이 잡혀있다. 따라서, 삽입, 삭제, 검색 시 최악의 경우(worst-case)에서의 시간복잡도가 트리의 높이(깊이)에 따라 결정되기 때문에 보통의 이진검색 트리에 비해 효율적이다.

### Double Red 해결 전략

이렇게 연속해서 빨강 노드가 오게 되었을 때 해결 방법은 두가지 이다.

현재 insert된 노드의 uncle node(부모 노드의 형제 노드)를 w라고 할때,

- w==Black 👉 Restructuring
- w==Red 👉 Recoloring

즉, insert노드의 uncle node의 색을 기준으로 해결 전략이 달라지게 된다.

**Restructing**

1. 나(z)와 내 부모(v), 내 부모의 부모(Grand Parent)를 오름차순으로 정렬
2. 무조건 가운데 있는 값을 부모로 만들고 나머지 둘을 자식으로 만든다.
3. 올라간 가운데 있는 값을 검정(Black)으로 만들고 그 두자식들을 빨강(Red)로 만든다.

- Restructuring은 다른 서브트리에 영향을 끼치지 않기 때문에(4번조건) 한번의 과정으로 종료.
  - Restructing 전후의 Black 노드의 개수에 변화가 없기때문에 다른서브트리에 영향을 끼치지 않음
- Restructuring자체의 시간복잡도는 O(1)에 끝나지만, (순서결정시간 - 상수시간, 트리로 만드는시간 - 상수시간, 원래있던 노드들의 구조들을 바꿔주는 시간 - 상수시간)
  Restructuring은 어떤 노드를 insertion한 뒤 일어나므로 총 수행시간은 **O(logn)**이다. 지금 현재 노드가 들어갈 위치를 먼저 찾아야 하기 때문.

**Recoloring**

1. 현재 insert된 노드(c)의 부모(p)와 그 형제(u)를 검정(Black)으로 하고 Grand Parent(내 부모의 부모)를 빨강(Red)로 한다.
2. Grand Parent(내 부모의 부모)가 Root node가 아니었을 시 Double Red가 다시 발생 할 수 있다.

- Recoloring의 경우 Restructuring과 다르게 propagation될 수 있다. 최악의경우 Root까지 갈 수 있음.

**AVL Tree와 Red Black Tree 차이**

- AVL Tree가 Red Black Tree보다 빠른 Search를 제공
  - AVL Tree가 더 엄격한 Balanced를 유지하고 있기 때문
- Red Black Tree은 AVL Tree보다 빠른 삽입과 제거를 제공
  - AVL Tree보다 Balanced를 느슨하게 유지하고 있기 때문
- Red Black Tree는 AVL Tree보다 색깔을 저장하기 위해 더 많은 Space Complexity가 필요
- Red Black Tree는 대부분의 언어의 map, multimap, multiset에서 사용
- AVL tree는 조회에 속도가 중요한 Database에서 사용

# Heap

힙(heap)은 **완전이진트리(Complete binary tree)** 를 기본으로 한 자료구조(tree-based structure) (시간복잡도 : O(log N))

### 특징

- 일반적으로 배열을 사용하여 구현한다.배열에 트리의 값들을 넣어줄 때, 0 번째는 건너뛰고 1 번 index 부터 루트노드가 시작된다.
- 여러 개의 값들 중에서 최댓값이나 최솟값을 빠르게 찾아내도록 만들어진 자료구조이다. (우선순위큐 구현시 사용함)
- 힙은 일종의 반정렬 상태(느슨한 정렬 상태) 를 유지한다.
  - 큰 값이 상위 레벨에 있고 작은 값이 하위 레벨에 있다는 정도
  - 간단히 말하면 부모 노드의 키 값이 자식 노드의 키 값보다 항상 큰(작은) 이진 트리를 말한다.
- 힙 트리에서는 중복된 값을 허용한다. (이진 탐색 트리에서는 중복된 값을 허용하지 않는다.)

## 힙의 종류

### 최대 힙

부모노드의 키값이 자식노드의 키값보다 항상 큰 힙
Max Heap에서는 Root node 에 있는 값이 제일 크므로, 최대값을 찾는데 소요되는 연산의 time complexity 이 O(1)이다. 그리고 complete binary tree이기 때문에 배열을 사용하여 효율적으로 관리할 수 있다. (즉, random access 가 가능하다. Min heap 에서는 최소값을 찾는데 소요되는 연산의 time complexity 가 O(1)이다.)

### 최소 힙

부모노드의 키값이 자식노드의 키값보다 항상 작은 힙
키값의 대소관계는 부모-자식 간에만 성립하고 형제간에는 성립하지 않는다.

## 삽입

(max heap 기준)

1. 힙의 가장 마지막 원소에 원하는 값을 삽입한다.
2. 부모가 삽입 원소보다 작다면(Max_Heap기준) 부모와 자식의 값을 교환한다.
3. 2번에서 부모가 없거나, 부모가 자식보다 클 경우에 종료
   ![](https://images.velog.io/images/adam2/post/623dd9fb-a1b4-4477-bdaa-0f23627e140d/image.png)

## 삭제

(max heap 기준)

1. 루트노드를 삭제하고 힙의 마지막 노드를 루트로 가져온다.
2. 가져온 루트와 자식노드를 비교하고 가져온 노드가 작을 경우 자식과 위치 변경
3. 자식 노드가 더이상 없거나, 자식보다 클 경우 종료
   ![](https://images.velog.io/images/adam2/post/c9a9ff62-0d59-4606-8558-de6a530d1274/image.png)

---

참고
https://gmlwjd9405.github.io/2018/08/12/data-structure-tree.html
https://wayhome25.github.io/cs/2017/04/19/cs-23/
https://coderkoo.tistory.com/10
https://zeddios.tistory.com/237
https://nesoy.github.io/articles/2018-08/Algorithm-RedblackTree

---

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
